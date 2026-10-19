# FileVault

FileVault is a small file-sharing web app. Upload a file, get a short ID, and send that ID to whoever needs the file. There are no accounts. Every upload is deleted automatically after 15 minutes.

**Live demo:** http://56.228.91.213:8080

## Features

- Upload any file type up to 100 MB
- Each upload gets a random 16-character ID that is shown once
- Download a file by entering its ID; it is served with its original filename
- Files expire after 15 minutes: MongoDB removes the record and a background job deletes the file from disk
- Clear error messages for missing files, oversized uploads, empty input and unknown or expired IDs
- Responsive interface that works on desktop and mobile

## Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Server       | Node.js, Express 5            |
| Database     | MongoDB with Mongoose         |
| Views        | EJS (server-side rendering)   |
| File uploads | Multer                        |
| Hosting      | AWS EC2, Nginx, PM2           |

## How It Works

**Uploading.** Multer writes the file to `uploads/` as `<timestamp>-<original name>` and rejects anything over 100 MB. A record is then saved in MongoDB with the original name and the path on disk. The record's `_id` is generated with `crypto.randomBytes`, so IDs cannot be guessed from one another, and it is shown to the user on the home page.

**Downloading.** The ID is trimmed and looked up. If the record exists, is less than 15 minutes old and the file is still on disk, the file is sent with `res.download` using its original name. Otherwise the download page shows an error.

**Expiry.** The `createdAt` field has a MongoDB TTL index (`expires: '15m'`), so the database removes expired records on its own. TTL only touches the database, though, so `cleanup.js` scans `uploads/` once a minute and deletes any file older than 15 minutes. Since MongoDB's TTL monitor can lag by up to a minute, the download handler also checks the record's age itself.

### Routes

| Method | Path        | Description                          |
|--------|-------------|--------------------------------------|
| GET    | `/`         | Home page (shows the ID after upload)|
| GET    | `/upload`   | Upload form                          |
| POST   | `/upload`   | Upload a file                        |
| GET    | `/download` | Download form                        |
| POST   | `/download` | Look up an ID and download the file  |

## Running Locally

You need Node.js 20+ and a running MongoDB instance.

```bash
git clone https://github.com/HumayunSaghir/FileVault.git
cd FileVault
npm install
```

Create a `.env` file in the project root:

```
MONGO_URL=mongodb://127.0.0.1:27017/filevault
PORT=8000
```

Start the server:

```bash
npm run dev     # with nodemon
npm start       # without
```

The app runs at http://localhost:8000. The `uploads/` folder is created on startup if it does not exist.

### Environment Variables

| Variable    | Required | Description                                  |
|-------------|----------|----------------------------------------------|
| `MONGO_URL` | Yes      | MongoDB connection string                    |
| `PORT`      | No       | Port the server listens on (default `8000`)  |

## Deployment

The live demo runs on an AWS EC2 instance (t4g.micro, Ubuntu 24.04) that also hosts another app on port 80. Nginx listens on port 8080 for FileVault and proxies to the Node process on port 8001, which PM2 keeps running. MongoDB runs on the same machine and only listens on localhost.

```
Client → Nginx :8080 → Node.js (PM2) :8001 → MongoDB :27017 (localhost)
```

The steps below assume Node.js 20, PM2, Nginx and MongoDB are already installed on the instance, and that the security group allows inbound TCP on port 8080.

### 1. Set up the app

```bash
git clone https://github.com/HumayunSaghir/FileVault.git
cd FileVault
npm ci --omit=dev
```

Create `.env`:

```
MONGO_URL=mongodb://127.0.0.1:27017/filevault
PORT=8001
```

Start it with PM2 from inside the project folder, since `uploads/`, `views/` and `.env` are resolved relative to it:

```bash
pm2 start app.js --name filevault
pm2 save
```

### 2. Configure Nginx

Create `/etc/nginx/sites-available/filevault`:

```nginx
server {
    listen 8080;
    listen [::]:8080;
    server_name _;

    client_max_body_size 110M;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`client_max_body_size` is set slightly above the app's 100 MB limit so that oversized files reach the app and get a proper error message instead of an Nginx error page.

Enable it and reload:

```bash
sudo ln -s /etc/nginx/sites-available/filevault /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Updating

```bash
cd ~/FileVault
git pull
npm ci --omit=dev
pm2 restart filevault
```

## Project Structure

```
FileVault/
├── app.js              Entry point: middleware, router, 404 handler
├── cleanup.js          Deletes expired files from uploads/ every minute
├── connection.js       MongoDB connection
├── controllers/
│   └── files.js        Upload and download handlers
├── middlewares/
│   └── logs.js         Request logger
├── models/
│   └── files.js        File schema with random IDs and a 15-minute TTL
├── routes/
│   └── files.js        Routes and Multer configuration
├── views/
│   ├── home.ejs        Home page, shows the ID after upload
│   ├── upload.ejs      Upload page
│   └── download.ejs    Download page
└── uploads/            Uploaded files (not tracked in git)
```

## Known Limitations

- Files are stored on the server's disk, so all uploads share that disk's space. Object storage such as S3 would scale better.
- Anyone who has an ID can download the file; there is no password or one-time-download option.
- The demo is served over plain HTTP because it has no domain name attached.

## Author

**Humayun Saghir**
- GitHub: [@HumayunSaghir](https://github.com/HumayunSaghir)
- Email: hr32967262@gmail.com
