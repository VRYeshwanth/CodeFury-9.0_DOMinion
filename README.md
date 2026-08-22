# 🎧 Saathi — Voice-First Daily Assistant for Elderly Indians

> A simple, voice-first digital assistant designed specifically for elderly users who struggle with complex smartphone interfaces.

Saathi helps elderly users understand digital messages, practice UPI transactions safely, and quickly contact a trusted person during an emergency.

The application focuses on **simplicity rather than adding more features**.

## 🧩 Problem

Many elderly users can operate a smartphone but struggle with:

- Understanding bank SMS messages
- Understanding complicated digital notifications
- Navigating multi-step UPI interfaces
- Knowing what action they need to take
- Quickly contacting a trusted family member during an emergency

Existing applications often assume that users are comfortable reading small text, navigating multiple screens, and understanding technical terminology.

Saathi provides a simplified interface with:

- Large buttons
- High-contrast UI
- Voice input
- Voice output
- Simple language
- One-step-at-a-time guidance

## 🌍 Supported Languages

- English
- Kannada

## ✨ Core Features

### 1. Message Explainer

Users can paste or speak a message they received.

Saathi sends the message to the backend, which uses the Groq API to explain it in simple language.

Example:

> "Your bank account has been debited by ₹2,000."

Saathi explains what the message means and what the user should do.

### 2. Guided UPI Simulation

Saathi provides a completely simulated UPI transaction flow.

The user is guided through:

1. Selecting a recipient
2. Entering an amount
3. Reviewing the transaction
4. Confirming or cancelling it

No real money is transferred.

### 3. Emergency Contact

A large emergency button allows the user to quickly contact a trusted person using the phone's calling or messaging functionality.

---

## Hackathon

**Project:** Saathi

**Repository:** `CodeFury-9.0_DOMinion`

**Team Size:** 3

**Team Members:** VR Yeshwanth, Manoj, Shrisamarth

The project was designed as a hackathon-focused prototype with an emphasis on usability, accessibility, and a clear real-world problem.

# 🏛️ Architecture

Saathi follows a simple client-server architecture.

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │                      │
                    │ HTML / CSS / JS      │
                    │ Web Speech API       │
                    └──────────┬───────────┘
                               │
                               │ HTTP / JSON
                               ▼
                    ┌──────────────────────┐
                    │      Express         │
                    │      Backend         │
                    │                      │
                    │ Authentication       │
                    │ Sessions             │
                    │ UPI Simulation       │
                    │ Message Explainer    │
                    └───────┬───────┬──────┘
                            │       │
                            │       │
                            ▼       ▼
                    ┌──────────┐  ┌──────────┐
                    │  Groq    │  │ In-memory│
                    │   API    │  │ Sessions │
                    └──────────┘  └──────────┘
```

# 🔄 Request Flow

## Message Explainer
```
User
 │
 ▼
Frontend
 │
 ├── POST /api/explain
 │
 ▼
Express Backend
 │
 ▼
Groq API
 │
 ▼
Simple explanation
 │
 ▼
Frontend
 │
 ▼
Voice output
```
## Authentication
```
Frontend
 │
 ├── POST /api/auth/register
 │
 └── POST /api/auth/login
             │
             ▼
       Express Backend
             │
             ▼
       Password hashing
             │
             ▼
          JWT
             │
             ▼
      HTTP-only cookie
```

## UPI Simulation
```
Frontend
 │
 ▼
POST /api/sessions
 │
 ▼
Create session
 │
 ▼
POST /api/sessions/:id/upi/start
 │
 ▼
Recipient
 │
 ▼
Amount
 │
 ▼
Confirmation
 │
 ▼
Simulated completion
```


---

# 💻 Tech Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
  - Speech Recognition
  - Speech Synthesis
- Fetch API

The frontend intentionally uses vanilla web technologies to keep the application lightweight and easy to deploy.

## Backend

- Node.js
- Express.js
- JavaScript
- REST API

## AI

- Groq API
- Large Language Model for message explanation

The AI integration is intentionally simple. The backend receives a message, sends it to Groq with a carefully designed prompt, and returns the explanation.

## Authentication

- JSON Web Tokens (JWT)
- HTTP-only cookies
- bcrypt password hashing
- Helmet
- CORS
- Express Rate Limit

Authentication is implemented directly in the backend without Firebase, Supabase, Auth0, or another external authentication provider.

## Deployment

- Frontend: Render
- Backend: Render
- AI: Groq API

---

# 🤔 Why These Technologies?

### Vanilla JavaScript

The project does not require a large frontend framework. Vanilla JavaScript keeps the application small and makes the accessibility-focused UI easier to control.

### Express

Express provides a lightweight backend for:

- Authentication
- API routing
- Session management
- Groq integration
- UPI simulation

### Groq

Groq provides fast inference suitable for an interactive message explanation experience.

### Web Speech API

The browser provides speech recognition and text-to-speech functionality without requiring an additional speech-processing backend.

### JWT + HTTP-only Cookies

Authentication uses JWTs stored in HTTP-only cookies so that authentication tokens are not directly accessible to frontend JavaScript.

---

# 🛠️ Installation

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- Git

Check:

```bash
node --version
npm --version
git --version
```

## Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/CodeFury-9.0_DOMinion.git
cd CodeFury-9.0_DOMinion
```

## Backend Setup
**Go into backend folder**
```bash
cd backend
npm install
```

**Create environemnt file `.env` containing the following:**
```bash
PORT=5000
FRONTEND_URL=http://127.0.0.1:5500 (Replace 5500 with the port obtained when running index.html in live preview)
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_long_random_secret
```

**Start the backend:**
```bash
npm run dev
```

**and test the health endpoint**
```bash
GET http://localhost:5000/api/health
```

## Frontend setup
The Frontend is a static HTML/CSS/JS application. Do not open **`index.html`** directly using the file explorer because browser security policies can cause CORS and API issues.

Instead, serve the frontend using a local development server like live preview.
```bash
Right click index.html
        ↓
Open with Live Server
```