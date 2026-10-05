# Graphics Haven — Creative Design Studio

A modern, high-performance website and content management portal for **Graphics Haven**, built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, and Cloudinary.

---

## Features

- **Responsive Design**: Fluid typography and layouts optimized across mobile, tablet, and widescreen displays.
- **Admin Portal (`/admin`)**:
  - Secure JWT authentication with MongoDB Atlas.
  - Manage Portfolio projects, Blog posts, Services, Clients, and Testimonials.
  - Cloudinary image uploader with drag-and-drop and instant CDN preview.
  - View, filter, and manage client contact inquiries.
- **Client Inquiry System**:
  - Interactive project inquiry modal with multi-step flow.
  - Email notifications via Nodemailer (`graphicshaven4@gmail.com`).
  - Saved to MongoDB database.
- **Database & Media**:
  - Real-time synchronization with MongoDB Atlas via Mongoose models.
  - Cloudinary cloud storage for high-resolution images.

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** (Mongoose ODM)
- **Cloudinary SDK** + **Multer** (Media Upload)
- **JWT** (JSON Web Tokens) + **bcryptjs**
- **Nodemailer** (Email notifications)

---

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd graphicshaven
```

### 2. Install dependencies

Frontend:
```bash
npm install
```

Backend:
```bash
cd server
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the `server/` directory based on `server/.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

# Nodemailer
NOTIFICATION_EMAIL=graphicshaven4@gmail.com
EMAIL_FROM="Graphics Haven Studio" <no-reply@graphicshaven.in>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Seed Admin Account
```bash
cd server
npm run seed:admin
cd ..
```

### 5. Run the Project
Start backend:
```bash
cd server
npm start
```

Start frontend (in a separate terminal):
```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin)
- Backend API: [http://localhost:5000](http://localhost:5000)
