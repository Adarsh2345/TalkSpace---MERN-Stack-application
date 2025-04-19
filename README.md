# TalkSpace - MERN Stack Chatting Application 💬

![MERN Stack](https://img.shields.io/badge/MERN-4EA94B?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

TalkSpace is a real-time chat application built with the **MERN stack (MongoDB, Express.js, React, Node.js)** and **Socket.io** for live messaging.

---

## Features ✨
- **Real-time messaging** with Socket.io
- **User authentication** (JWT)
- **Responsive React UI**
- **Online status indicators**
- **Message history** (MongoDB)

---

## Prerequisites 📋
- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **MongoDB** (Atlas or local) - [Guide](https://www.mongodb.com/)
- **React** (v18+) - Included with `create-react-app`
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Adarsh2345/TalkSpace---MERN-Stack-application.git
cd TalkSpace---MERN-Stack-application
```

### 2. Install dependencies

#### Frontend (React)
```bash
cd client
npm install
```

#### Backend (Node.js/Express)
```bash
cd ../server
npm install
```

### 3. Configure environment
Create `.env` file in `/server`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Run the application
In separate terminals:

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm start
```

Access at: http://localhost:5000

