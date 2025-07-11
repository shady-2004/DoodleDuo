<img width="888" height="736" alt="image" src="https://github.com/user-attachments/assets/92d58b75-def4-4ffa-b833-1219c8957622" /><img width="1900" height="918" alt="image" src="https://github.com/user-attachments/assets/269297c7-85dd-4496-a207-05f4b5140e47" />
# 🖌️ DoodleDuo

**DoodleDuo** is a real-time collaborative sketching web app. Draw solo or start a live session and invite a friend using a unique code to sketch together instantly.

---

## 🌐 Live Demo

🔗 [Launch DoodleDuo](doodle-duo.vercel.app)

---

## 🖼️ Preview

<img width="1918" height="903" alt="image" src="https://github.com/user-attachments/assets/36cbedeb-4119-4f1a-9580-9a1b678ce3b5" />


> *Above: Solo sketch mode with drawing tools and session buttons*

---

## 🚀 Features

- 🎨 **Solo Drawing** – Sketch on a responsive canvas using brush and color options.
- 👥 **Collaborative Drawing** – Start or join a live session and draw together in real time.
- 💡 **Simple Session System** – One-click session creation and code sharing.
- ⚡ **Instant Syncing** – Live drawing updates powered by `Socket.IO`.

---

## 🧭 How It Works

### ✏️ Solo Drawing

- Open the app and start sketching right away.
<img width="1911" height="877" alt="image" src="https://github.com/user-attachments/assets/e0acc2cd-db9f-4f12-8179-c0d582f67824" />

- Use the toolbar to:
  - ✏️ Change brush color
  - 🧹 Clear the canvas
   <img width="1894" height="855" alt="image" src="https://github.com/user-attachments/assets/4fd14c3b-d0d5-421b-98f0-173b388fb809" />


### 👥 Creating a Session

1. Click **"Create Session"**.
2. A unique session code appears (e.g., `A1B2C3`).
3. Share this code with a friend.
  <img width="1899" height="182" alt="image" src="https://github.com/user-attachments/assets/d6b084d3-1285-4f62-a9cc-0b8112d81977" />


### 🔗 Joining a Session

1. Click **"Join Session"**.
2. Enter the shared session code.
3. Start drawing together in real-time!
<img width="888" height="736" alt="image" src="https://github.com/user-attachments/assets/d71c663a-2443-47dd-8236-6ac3263cf77b" />

---

## 🛠️ Tech Stack

### Frontend
- **React (JavaScript)** – Interactive UI and application logic
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Konva + React-Konva** – Canvas rendering and drawing functionality

### Backend
- **Node.js + Express (TypeScript)** – REST API and session management
- **Socket.IO** – Real-time drawing synchronization
- **MongoDB** – Database for storing session info, user data, or saved sketches


