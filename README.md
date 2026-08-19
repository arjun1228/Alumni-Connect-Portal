<div align="center">

# 🎓 AlumniConnect Portal

### A Modern Alumni–Student Networking & Career Mentorship Platform

[![React](https://img.shields.io/badge/React_19-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js_Express-%23339933.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-%2347A248.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-%2338B2AC.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI_Llama_3.3-%23FF6B35.svg?style=flat&logo=meta&logoColor=white)](https://groq.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-%233448C5.svg?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![JWT Auth](https://img.shields.io/badge/JWT_Auth-%23000000.svg?style=flat&logo=jsonwebtokens&logoColor=white)](#-authentication)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth_2.0-%234285F4.svg?style=flat&logo=google&logoColor=white)](#-google-oauth)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-%23000000.svg?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

A high-performance, full-stack **MERN** platform designed to bridge the gap between **Students**, **Alumni**, and **Administrators**. Features real-time messaging, job postings, event management, academic calendars, file/resume attachments via **Cloudinary**, and an **AI-powered career coaching** feature backed by **Llama 3.3 70B via Groq Cloud**.

[Features](#-key-features) · [Tech Stack](#-tech-stack) · [Roles & Permissions](#-roles--permissions-matrix) · [Project Structure](#-project-structure) · [Database Models](#-database-models) · [API Endpoints](#-api-endpoints) · [Getting Started](#-getting-started) · [Deployment](#-deployment)

</div>

---

## ✨ Key Features

### 🔐 Secure Authentication & Google OAuth
- **JWT-based sessions** with role claims stored in HTTP-only cookies.
- **Google OAuth 2.0** login integration — sign in with your Google account in one click.
- **Email verification** flow for newly registered users (`VerifyEmail.jsx`).
- Middleware enforces authentication (`authenticate.js`) and role guards (`authorize.js`) on every protected route.

### 👥 Role-Based Access Control (RBAC)
Tailored dashboards and feature access for three distinct roles: **Students**, **Alumni**, and **Admins** — each with strictly enforced permissions across both the frontend and backend.

### 💬 Real-Time Direct Messaging
- Persistent, thread-based direct messaging between any two users on the platform.
- Conversation history stored in MongoDB and served via a RESTful API.
- **File & resume attachments** supported in the chat workspace — users can send files (e.g., resumes, documents) as message attachments, stored via Cloudinary.
- Unread message badges and conversation list with latest message preview.

### 📢 Community Feed & Posts
- Alumni and students can publish posts, share updates, and engage with the community feed.
- **AI-Powered Content Enhancement** — a "Groq AI Assist" button in the post composer to refine and elevate draft content instantly.
- Post **likes**, **comments**, and **image attachments** supported.
- Admins can **pin** important announcements and **delete** any post for moderation.
- **Shareable single-post routing** — each post has a unique shareable URL via `PostView`.

### 💼 Job Listings & Applications
- Alumni can post full-time, part-time, and internship job opportunities.
- Students can browse listings and submit applications with **resume/file uploads**.
- Full application tracking with status management (`pending`, `reviewed`, `accepted`, `rejected`).
- Alumni can manage their own postings (edit, activate/deactivate, delete).

### 🎟️ Events & Workshop Management
- Alumni can create and host workshops, networking events, and seminars.
- Students can register their interest for upcoming events.
- All users can browse an interactive event calendar.
- Admin controls for event moderation and management.

### 📅 Academic Calendar
- A dedicated academic calendar for students to track institutional key dates, deadlines, and personal schedule entries.
- Calendar entries stored per-user in MongoDB.
- Categorised by type: `exam`, `deadline`, `holiday`, etc.

### 🤖 AI Career Mentor (Groq Llama 3.3 70B)
A backend-routed AI coaching assistant powered by **Llama 3.3 70B** via Groq Cloud SDK, accessible from the AI Coach page:
- **Resume Analysis** — Structured, actionable feedback on CV content and formatting.
- **Interview Coaching** — Mock Q&A and behavioural question preparation.
- **Skill-Gap Roadmap** — Personalised learning paths based on career goals.
- **General Career Advice** — Open-ended mentorship conversations.

### 👥 Alumni Directory & Networking
- Browse and search a directory of all alumni on the platform.
- Filter by graduation year, company, job title, and skills.
- Initiate direct messaging with any alumni from their directory card.

### 🖼️ Cloudinary Media Storage
- All uploaded files (profile avatars, post images, job attachments, chat files, resumes) are stored in **Cloudinary** — not on the local filesystem.
- Automatic URL generation for each uploaded asset.
- Supports images, PDFs, and general documents.

### 🗄️ Offline / Hybrid Database Fallback
- If MongoDB Atlas is unreachable or `MONGO_URI` is not configured, the server automatically switches to a local `backend/data.json` flat-file database.
- Seeds default data on first run — zero configuration required for quick local development.

### 📊 Admin Dashboard & Analytics
- Full **user management**: view all users, suspend or reactivate accounts.
- **Platform analytics**: live statistics — total users, posts, jobs, events, active students, and alumni mentors. Statistics update dynamically as new users register.
- **Admin action audit log**: every admin action is recorded in `AdminLog`.
- Admins can message any platform user directly from the dashboard.

### 🔔 Toast Notification System
- Global, fluent toast notifications for all key events: authentication, post interactions, job operations, calendar additions, event registrations, and messaging.

### 📝 Enhanced Profiles
- Students: detailed academic info, skills, bio, and avatar.
- Alumni: company, job title, graduation year, mentoring domains, and bio.
- Profile photos uploaded to Cloudinary.

### 🌗 Dark Mode Support
- Full light/dark theme toggle available throughout the application.
- Implemented via Tailwind CSS v4 dark mode utilities.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS v4 + Custom CSS |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Backend Framework** | Node.js + Express.js |
| **Database (Primary)** | MongoDB Atlas (Mongoose ODM) |
| **Database (Fallback)** | Local JSON flat-file (`backend/data.json`) |
| **Authentication** | JWT (HTTP-only cookies) + Google OAuth 2.0 (Passport.js) |
| **AI / LLM** | Groq Cloud SDK — Llama 3.3 70B Versatile |
| **Media Storage** | Cloudinary (images, files, resumes, avatars) |
| **Deployment** | Vercel (frontend SPA + backend) |
| **Runtime** | Node.js v18+ |

---

## 👥 Roles & Permissions Matrix

| Feature / Page | Student | Alumni | Admin |
| :--- | :---: | :---: | :---: |
| **Auth (Login / Register / Google OAuth)** | ✅ | ✅ | ✅ |
| **Landing Page** | ✅ | ✅ | ✅ |
| **Community Feed** (View & Post) | ✅ | ✅ | ✅ |
| **Community Feed** (Pin & Delete any post) | ❌ | ❌ | ✅ |
| **Alumni Directory** | ✅ | ✅ | ✅ |
| **Job Listings** (View & Apply) | ✅ | ✅ | ✅ |
| **Job Listings** (Post & Manage) | ❌ | ✅ | ✅ |
| **Events & Workshops** (View & Register) | ✅ | ✅ | ✅ |
| **Events & Workshops** (Create & Manage) | ❌ | ✅ | ✅ |
| **Direct Messaging** (with file attachments) | ✅ | ✅ | ✅ |
| **Academic Calendar** | ✅ | ✅ | ✅ |
| **AI Career Mentor** | ✅ | ✅ | ✅ |
| **Profile Management** (Own Profile) | ✅ | ✅ | ✅ |
| **Admin Dashboard** | ❌ | ❌ | ✅ |
| **User Management** (Suspend / Reactivate) | ❌ | ❌ | ✅ |
| **Platform Analytics** | ❌ | ❌ | ✅ |
| **Admin Audit Logs** | ❌ | ❌ | ✅ |

---

## 📂 Project Structure

```
Alumni-Interaction-Portal/
├── backend/                  # Node.js + Express API Backend
│   ├── config/               # DB & environment configuration
│   ├── controllers/          # Business logic handlers for all features
│   ├── middleware/           # JWT Authentication, RBAC, error handlers
│   ├── models/               # MongoDB Mongoose schemas
│   ├── routes/               # API endpoint routing declarations
│   ├── services/             # Cloudinary, Groq AI, and offline DB services
│   └── server.js             # Express app entry point
└── frontend/                 # React 19 + Vite Frontend SPA
    ├── components/           # Feature UI views and design system components
    ├── services/api.js       # Centralized API client & HTTP endpoints
    └── vercel.json           # Routing & rewrite proxy configuration
```


---

## 🗄️ Database Models

### User
| Field | Type | Details |
| :--- | :--- | :--- |
| `name` | String | Full display name (required) |
| `email` | String | Account email address (required, unique) |
| `password` | String | Bcrypt-hashed credential |
| `role` | String | `student` / `alumni` / `admin` |
| `graduationYear` | Number | Year of graduation (alumni) |
| `company` / `jobTitle` | String | Current employer details (alumni) |
| `bio` / `skills` | String | Profile enrichment fields |
| `avatar` | String | Cloudinary URL of profile photo |
| `isActive` | Boolean | Admin suspension flag |
| `isVerified` | Boolean | Email verification status |
| `googleId` | String | Google OAuth ID |
| `mentorDomains` | Array | Alumni mentoring topics |

### Post
| Field | Type | Details |
| :--- | :--- | :--- |
| `author` | ObjectId | Post creator reference |
| `content` | String | Post body text (required) |
| `image` | String | Cloudinary URL of media attachment |
| `likes` | Array | Users who liked the post |
| `comments` | Array | Embedded comment objects |
| `isPinned` | Boolean | Admin pin flag |

### Message
| Field | Type | Details |
| :--- | :--- | :--- |
| `sender` / `receiver` | ObjectId | Conversation parties |
| `content` | String | Message body text |
| `fileUrl` | String | Cloudinary URL of attached file |
| `fileName` | String | Original filename |
| `fileType` | String | MIME type of attachment |
| `read` | Boolean | Read receipt flag |

### Job
| Field | Type | Details |
| :--- | :--- | :--- |
| `postedBy` | ObjectId | Alumni who created the listing |
| `title` / `company` / `location` | String | Core listing fields |
| `type` | String | `full-time` / `part-time` / `internship` |
| `isActive` | Boolean | Controls listing visibility |

### JobApplication
| Field | Type | Details |
| :--- | :--- | :--- |
| `job` | ObjectId | Applied-to listing |
| `applicant` | ObjectId | Applying student |
| `resumeUrl` | String | Cloudinary URL of uploaded resume |
| `status` | String | `pending` / `reviewed` / `accepted` / `rejected` |

### Event
| Field | Type | Details |
| :--- | :--- | :--- |
| `createdBy` | ObjectId | Event organiser |
| `title` / `description` / `location` | String | Event details |
| `date` | Date | Event date and time |
| `registrations` | Array | Registered user references |
| `maxAttendees` | Number | Capacity cap |

### CalendarEvent
| Field | Type | Details |
| :--- | :--- | :--- |
| `user` | ObjectId | Owning student reference |
| `title` | String | Event name |
| `date` | Date | Scheduled date |
| `type` | String | `exam` / `deadline` / `holiday` etc. |

### AdminLog
| Field | Type | Details |
| :--- | :--- | :--- |
| `admin` | ObjectId | Admin who performed the action |
| `action` | String | Description of the operation |
| `target` | ObjectId | Affected resource reference |

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/register` | No | Create a new user account |
| `POST` | `/login` | No | Authenticate and receive a JWT cookie |
| `POST` | `/logout` | Yes | Clear the session cookie |
| `GET` | `/me` | Yes | Get the currently authenticated user |
| `GET` | `/google` | No | Initiate Google OAuth 2.0 login |
| `GET` | `/google/callback` | No | Google OAuth callback handler |
| `POST` | `/verify-email` | No | Verify email with token |

### Posts (`/api/posts`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Yes | Fetch all community feed posts |
| `POST` | `/` | Yes | Create a new post |
| `PUT` | `/:id/like` | Yes | Toggle like on a post |
| `POST` | `/:id/comment` | Yes | Add a comment |
| `DELETE` | `/:id` | Yes | Delete a post (author or admin) |
| `PUT` | `/:id/pin` | Admin | Pin/unpin a post |
| `GET` | `/:id` | Yes | Get a single post by ID |

### Jobs (`/api/jobs`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Yes | List all active job postings |
| `POST` | `/` | Alumni | Create a job listing |
| `PUT` | `/:id` | Alumni | Update a listing |
| `DELETE` | `/:id` | Alumni | Remove a listing |
| `POST` | `/:id/apply` | Student | Submit a job application |

### Events (`/api/events`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Yes | List all events |
| `POST` | `/` | Alumni | Create an event |
| `PUT` | `/:id` | Alumni | Update an event |
| `DELETE` | `/:id` | Alumni | Delete an event |
| `POST` | `/:id/register` | Yes | Register for an event |

### Messages (`/api/messages`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/conversations` | Yes | Get all conversations |
| `GET` | `/:userId` | Yes | Fetch message history with a user |
| `POST` | `/` | Yes | Send a new direct message |

### Calendar (`/api/calendar`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Yes | Get calendar events for current user |
| `POST` | `/` | Yes | Create a new calendar entry |
| `DELETE` | `/:id` | Yes | Remove a calendar entry |

### AI Mentor (`/api/mentor`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/chat` | Yes | Send a prompt to Groq Llama 3.3 |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/users` | Admin | List all platform users |
| `PUT` | `/users/:id/suspend` | Admin | Suspend or reactivate a user |
| `GET` | `/logs` | Admin | Fetch admin audit logs |
| `GET` | `/analytics` | Admin | Get live platform statistics |

### Directory (`/api/directory`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Yes | Browse the alumni directory |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/:id` | Yes | Get a user public profile |
| `PUT` | `/:id` | Yes | Update profile details |

### Upload (`/api/upload`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/` | Yes | Upload an image or file to Cloudinary |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **Groq Cloud API Key** — required for AI Career Mentor ([get one free](https://console.groq.com/))
- **MongoDB Atlas URI** — optional; app auto-falls back to local JSON if omitted
- **Cloudinary Account** — required for media/file uploads ([free tier available](https://cloudinary.com/))
- **Google Cloud OAuth 2.0 Credentials** — optional; required only for Google login

### 1. Clone & Install

```bash
git clone https://github.com/arjun1228/Alumni-Interaction-Portal.git
cd Alumni-Interaction-Portal
npm run install:all
```

### 2. Environment Variables

**Backend** (`backend/.env.local`):
```
PORT=5000
JWT_SECRET=your_32_character_long_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/alumniconnect
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application

```bash
npm run dev
```

| Service | URL |
| :--- | :--- |
| **React Frontend** | http://localhost:3000 |
| **Express Backend API** | http://localhost:5000 |

---

## 🗄️ Database Storage (MongoDB Atlas)

The platform stores all application data persistently in a **MongoDB** database (using **MongoDB Atlas** in production).
- **Persistent Collections**: Core models like Users (Students, Alumni, Admins), Messages (Direct Chat), Posts (Community Feed), Jobs, Job Applications, Academic Calendars, Events, and Admin Logs are stored securely in MongoDB.
- **Mongoose ODM**: Structured schemas and validation rules are defined using Mongoose models located in `backend/models/`.
- **Hybrid Database Mode (Auto-Switching)**: If the `MONGO_URI` environment variable is not configured or MongoDB Atlas is unreachable, the system automatically falls back to a local JSON database file (`backend/data.json`) managed by `backend/services/dataStore.js`.
  
  > ⚠️ **Important**: The local JSON fallback mode is intended strictly for rapid local development and testing. For full production deployments, a MongoDB Atlas URI must be configured.

---

## 🚢 Deployment & Live Links

The platform is fully deployed and configured to run in production.

### 🔗 Production URLs
- **Frontend SPA**: [https://alumni-interaction-portal-hazel.vercel.app](https://alumni-interaction-portal-hazel.vercel.app)
- **Backend API (Render)**: [https://alumniconnect-backend-u44v.onrender.com](https://alumniconnect-backend-u44v.onrender.com)

### ⚙️ Vercel Routing & API Proxy Configuration
To eliminate Cross-Origin Resource Sharing (CORS) blocks and ensure clean routing for the SPA, the Vercel routing configuration `vercel.json` is set up to rewrite `/api/*` requests directly to the backend service deployed on Render:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://alumniconnect-backend-u44v.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps to Deploy
1. **Deploy Backend**:
   - Create a web service on [Render](https://render.com) or [Railway](https://railway.app).
   - Set the root directory/build commands to run the Node/Express backend.
   - Configure all environment variables (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) in your deployment dashboard.
2. **Deploy Frontend**:
   - Connect the repository to [Vercel](https://vercel.com).
   - The root configuration will automatically serve the frontend and proxy `/api` calls to the live backend URL.

---

## ☁️ Cloudinary Media Integration

The application integrates with **Cloudinary** for scalable, cloud-based media and file hosting.
- **Upload Coverage**: All user avatars, community feed images, job/resume attachments, and direct message file attachments are uploaded directly to Cloudinary via the backend `/api/upload` endpoint.
- **Handling Middleware**: Implemented using `multer` + the Cloudinary Node SDK inside `backend/services/mediaUpload.js`.
- **Environment Variables**: Requires the following variables in the backend settings:
  ```env
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```


---

## 📊 Live Statistics

The Admin Analytics page shows **live, dynamic metrics** that update as users register:

| Metric | Description |
| :--- | :--- |
| **Active Students** | Count of all active student accounts |
| **Alumni Mentors** | Count of all verified alumni accounts |
| **Total Posts** | Community feed post count |
| **Job Listings** | Active job opportunity count |
| **Events Hosted** | Total events created on the platform |
| **Messages Sent** | Total direct messages exchanged |

Fetched live from MongoDB via `/api/admin/analytics`.

---

## 🔒 Security

- JWT tokens stored in HTTP-only cookies — not localStorage (prevents XSS).
- Role-based middleware on every backend route.
- Bcrypt password hashing (10 salt rounds).
- `.env.local` files are gitignored — credentials never committed to source control.
- Cloudinary API keys are scoped and never exposed to the frontend.

---

## 🙏 Built With

| Technology | Purpose |
| :--- | :--- |
| [React 19](https://react.dev/) | Frontend UI library |
| [Vite](https://vitejs.dev/) | Frontend build tool and dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS framework |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Express.js](https://expressjs.com/) | Backend web framework |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| [Groq SDK](https://groq.com/) | AI / LLM API client (Llama 3.3 70B) |
| [Cloudinary Node SDK](https://cloudinary.com/) | Media upload and storage |
| [Passport.js](https://www.passportjs.org/) | Google OAuth 2.0 strategy |
| [Multer](https://github.com/expressjs/multer) | Multipart file upload middleware |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT signing and verification |

---

<div align="center">

Made with love by [Arjun](https://github.com/arjun1228)

</div>
