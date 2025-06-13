# Salon Management System

A comprehensive fullstack application for managing beauty salons and hair studios. This system provides a modern, efficient solution for salon owners to manage appointments, clients, services, and staff.

## Features

### Client Management
- Client profiles and history
- Appointment scheduling
- Service preferences
- Contact information management

### Appointment System
- Real-time availability checking
- Automated reminders
- Calendar integration
- Service duration tracking

### Staff Management
- Staff schedules
- Service assignments
- Performance tracking
- Commission calculations

### Business Analytics
- Revenue tracking
- Service popularity metrics
- Client retention statistics
- Staff performance reports

![image](https://github.com/user-attachments/assets/21573cfb-0434-41a0-b8c8-3363ac173acf)
![image](https://github.com/user-attachments/assets/bf930fae-7677-494f-8096-0dd340b64644)
![image](https://github.com/user-attachments/assets/91e4663d-94aa-4b96-a786-dbe51aea8d9e)
![image](https://github.com/user-attachments/assets/064b1e77-dfbb-4cca-9efc-e1b5458bc077)
![image](https://github.com/user-attachments/assets/cb664d52-bf05-4e2a-a441-062b7a2055b6)
![image](https://github.com/user-attachments/assets/fe1a3642-8c22-492a-99de-d8b8b43277ee)
![image](https://github.com/user-attachments/assets/b66ddd61-183a-4057-86d5-bf5e23b20606)


## Project Structure

The project is organized into two main components:

### Frontend (`/frontend`)
- Modern React application with TypeScript
- Responsive design for all devices
- Component-based architecture
- State management with React Context
- Form handling with React Hook Form
- UI components with Material-UI

### Backend (`/backend`)
- RESTful API built with Express.js
- TypeScript for type safety
- MongoDB database integration
- JWT authentication
- Input validation
- Error handling middleware

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript 5.0+
- **Build Tool**: Vite
- **State Management**: React Context API
- **UI Library**: Material-UI
- **HTTP Client**: Fetch
- **Code Quality**: ESLint

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript 5.0+
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Package Manager**: npm

## System Requirements

- Node.js 18.x or higher
- npm 9.x or higher / yarn 1.22.x or higher
- MongoDB 6.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

### Prerequisites
1. Install Node.js and npm/yarn
2. Install MongoDB
3. Clone the repository:
```bash
git clone https://github.com/yourusername/salon-management-system.git
cd salon-management-system
```

### Frontend Setup
```bash
cd frontend
npm install

### Backend Setup
```bash
cd backend
npm install


## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5173
VITE_APP_NAME=Salon Management
```

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/salon
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## API features

- Available endpoints
- Request/response formats
- Authentication requirements
- Error codes and handling

## Testing

### Frontend Tests
- Unit tests for components
- Integration tests for features
- E2E tests with Cypress

### Backend Tests
- Unit tests for services
- Integration tests for API endpoints
- Database integration tests

## Deployment

### Frontend Deployment
1. Set up environment variables
2. Build the application:
```bash
cd frontend
npm run dev
```

### Backend Deployment
1. Set up environment variables

2. Build the application:
```bash
cd backend
npm run dev
```


## Code Style

- Follow the TypeScript style guide
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Document new features and changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- All contributors who have helped shape this project 
