# HairMaster

HairMaster is a modern fullstack application for managing hair salons. It enables clients to book appointments online and allows salon owners to manage schedules in a simple and efficient way.

## ✨ Features

### 📅 Appointment Booking
- View available time slots without logging in
- Book appointments as a registered user
- Book an appointment on behalf of someone else (e.g., family member)
- Automatic service duration handling

### 👤 User Account Management
- JWT-based authentication
- Secure password storage (bcrypt)
- Personal information tied to user accounts
- Booking history (coming soon)

### 🔒 Security
- Encrypted passwords with `bcrypt`
- Token-based sessions with `JWT`
- Cookie support for secure frontend-backend communication

![image](https://github.com/user-attachments/assets/21573cfb-0434-41a0-b8c8-3363ac173acf)
![image](https://github.com/user-attachments/assets/bf930fae-7677-494f-8096-0dd340b64644)
![image](https://github.com/user-attachments/assets/91e4663d-94aa-4b96-a786-dbe51aea8d9e)
![image](https://github.com/user-attachments/assets/064b1e77-dfbb-4cca-9efc-e1b5458bc077)
![image](https://github.com/user-attachments/assets/cb664d52-bf05-4e2a-a441-062b7a2055b6)
![image](https://github.com/user-attachments/assets/fe1a3642-8c22-492a-99de-d8b8b43277ee)
![image](https://github.com/user-attachments/assets/b66ddd61-183a-4057-86d5-bf5e23b20606)


## 📁 Project Structure

```
HairMaster/
├── backend/      # Express API + MongoDB
├── frontend/     # React application (with Vite)
```

## 🛠️ Technology Stack

### 🔧 Backend (`/backend`)
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Encryption**: bcrypt
- **Environment Variables**: dotenv

### 🎨 Frontend (`/frontend`)
- **Framework**: React 19
- **Routing**: React Router DOM 7
- **Language**: TypeScript
- **Build Tool**: Vite
- **Date Picker**: React Calendar

## 🚀 Getting Started

### Requirements
- Node.js v18+
- MongoDB v6+

### Clone the repository
```bash
git clone https://github.com/kamilz12/HairMaster.git
cd HairMaster
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside `/backend`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hairmaster
JWT_SECRET=your_secret_key
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file inside `/frontend`:
```
VITE_API_URL=http://localhost:3000
```

## 🧪 Testing

> Currently, no unit or integration tests are implemented. The `"test"` script is a placeholder.

## 📌 Planned Features

- Staff management dashboard
- Business analytics & metrics
- Service duration & availability configuration
- Admin panel for approving bookings

## 📄 License

This project is licensed under the **MIT License**.

## 📬 Support

If you encounter issues or have suggestions, feel free to open an issue in the repository.

