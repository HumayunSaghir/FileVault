# FileVault

A lightweight file-sharing web app. Upload any file and get a unique ID — share it with anyone to instantly retrieve and download. No accounts, no sign-up, no friction. Files are automatically deleted after **15 minutes**.

---

## Features

- **No account required** — upload and share instantly
- **Any file type** — PDFs, images, videos, ZIPs, documents, and more
- **10 MB file size limit**
- **Unique ID per upload** — share the ID with anyone to let them download
- **Auto-expiry** — files and records are deleted after 15 minutes via MongoDB TTL
- **Responsive UI** — works on desktop, tablet, and mobile

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Runtime  | Node.js                           |
| Framework| Express.js                        |
| Database | MongoDB + Mongoose                |
| Uploads  | Multer                            |
| Views    | EJS                               |
| Config   | dotenv                            |

---

## Project Structure

```
FileVault/
├── controllers/
│   └── files.js          # Request handlers
├── models/
│   └── files.js          # Mongoose schema with TTL
├── routes/
│   └── files.js          # Express routes + Multer config
├── views/
│   ├── home.ejs          # Homepage with ID display
│   ├── upload.ejs        # File upload page
│   └── download.ejs      # File download page
├── uploads/              # Uploaded files (gitignored)
├── app.js                # App entry point
├── connection.js         # MongoDB connection
├── .env                  # Environment variables (gitignored)
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
# Clone the repository
git clone https://github.com/HumayunSaghir/FileVault.git
cd FileVault

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_URL="mongodb://127.0.0.1:27017/filevault"
```

For production, replace `MONGO_URL` with your MongoDB Atlas connection string.

### Run Locally

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Visit `http://localhost:8000`

---

## Deployment

This app is ready to deploy on platforms like **Render**, **Railway**, or **Fly.io**.

**Before deploying:**

1. Set the following environment variables on your hosting platform:
   - `PORT` — usually set automatically by the platform
   - `MONGO_URL` — your MongoDB Atlas connection string

2. Make sure the `uploads/` folder exists on the server (the included `.gitkeep` handles this).

> **Note:** Most cloud platforms use an ephemeral filesystem, meaning uploaded files may not persist across restarts. For production-grade storage, consider integrating AWS S3 or Cloudinary.

---

## Author

**Humayun Saghir**
- GitHub: [@HumayunSaghir](https://github.com/HumayunSaghir)
- Email: hr32967262@gmail.com
