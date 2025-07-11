# 🖌️ DoodleDuo

**DoodleDuo** is a real-time collaborative sketching web app. Draw solo or start a live session and invite a friend using a unique session code to sketch together instantly. It's fast, clean, and designed for instant creativity.

---

## 🌐 Live Demo

🔗 [Launch DoodleDuo](https://doodle-duo.vercel.app)

---

## 🚀 Features

- 🎨 **Solo Drawing** – Sketch on your own using an intuitive canvas.
- 👥 **Collaborative Sessions** – Share a session code and draw together live.
- ✏️ **Brush Tools** – Select different colors and stroke sizes.
- 🧹 **Clear Canvas** – Start fresh with a single click.
- 🔗 **Live Sync with Socket.IO** – Real-time updates between users.

---

## 🛠️ Tech Stack

### Frontend
- **React (JavaScript)** – Interactive UI and application logic
- **Tailwind CSS** – Utility-first styling framework
- **Konva + React-Konva** – High-performance canvas rendering

### Backend
- **Node.js + Express (TypeScript)** – API, session, and socket setup
- **Socket.IO** – Real-time drawing synchronization
- **MongoDB** – Stores users and sketches 

---

## 🧭 How It Works

### ✏️ Solo Drawing
- Start sketching as soon as the page loads.
- Use the toolbar to:
  - Change brush color
  - Adjust stroke width
  - Clear the canvas

### 👥 Start a Session
- Click **“Create Session”**
- Copy the generated **session code**
- Share it with a friend

### 🔗 Join a Session
- Click **“Join Session”**
- Enter a valid session code
- Start drawing together in real time

---

## 📸 Screenshots

- **Solo Drawing Interface**  
  The clean canvas with a toolbar for colors and stroke sizes, perfect for solo sketching.  
  <img src="https://github.com/user-attachments/assets/5665b396-3236-4970-a1b4-9d4786ed22e9" alt="Solo Drawing Interface" width="600">


- **Collaborative Session**  
  Two users drawing together in real-time with seamless Socket.IO sync.  
  <img src="https://github.com/user-attachments/assets/3f99d036-5aef-4585-bb37-3f21ddd755f5" alt="Collaborative Session" width="600">

- **Create Session**  
  Generate a unique session code to share for collaborative sketching.  
  <img src="https://github.com/user-attachments/assets/d6ff568e-f6ee-4229-a338-82c24d69d758" alt="Create Session" width="600">

- **Join Session**  
  Enter a session code to join a friend’s live drawing session.  
  <img src="https://github.com/user-attachments/assets/2dc6c007-8930-4220-a985-d23d60ed5d5d" alt="Join Session" width="600">


- **Multiple Sketch Support**  
  Easily manage and switch between different sketches or sessions. Great for working on multiple ideas or saving progress separately.  
  <img src="https://github.com/user-attachments/assets/45d7c9e5-02ac-4f13-a0e6-1e0e82e43fcc" alt="Multiple Sketch Support" width="600">
