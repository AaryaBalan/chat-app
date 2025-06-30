# 💬 Real-Time Chat System

A fully functional, real-time chat web application built using **React**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Designed to be responsive, fast, and scalable — perfect for developer collaboration, internal tools, or community platforms.

## 🚀 Features

- 🔁 Real-time messaging with Socket.IO
- ✍️ Typing indicators
- ✅ Online/offline presence detection
- 🎨 Tailwind CSS powered responsive UI
- 🔐 JWT-based secure session management
- 📦 Scalable backend with Express & MongoDB

---

## 📂 Project Structure

```bash
root/
│
├── client/            # Frontend (React + Tailwind CSS)
│
└── server/            # Backend (Node.js + Express + MongoDB)
```
---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/realtime-chat-app.git
cd realtime-chat-app
```
```
cd client
npm install
npm start
```
```
cd server
npm install
npm run dev
```
```
PORT=5000
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```
```
npm install tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```
