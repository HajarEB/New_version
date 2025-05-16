# Hospital App

This is a secure Hospital Application for Booking, Viewing and Managing Appointments and Users. This project consists of:
- **Backend**: FastAPI and Python
- **Frontend**: Angular with TypeScript, HTML and CSS
- **Database**: SQLite

This application can be run manually on local machine or by using **Docker containerization**. As for checking security practices, it also includes **Jenkins** pipelines for testing

## Features
- Register and login with strong password using OAuth2 and JWT
- Logout with Token Blacklist Implementation​
- Role-based Access Control with 5 Roles: Default Admin, Admin, Doctor, Patient and User
- Password and sensitive data encryption on Database
- Secure communication using HTTPS
- Input validation and error handling

## Prerequisites
- Requires
  - [Node.js](https://nodejs.org/)
  - [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Setup
1. Clone the repository
  ```bash
  git clone https://github.com/HajarEB/hospitalApp.git
  ```
2. Navigate to backend folder
  ```bash
  cd hospitalApp/backend
  ```
3. Configure .env file
  ```bash
  ALGORITHM = "HS256" 
  JWT_SECRET_KEY = "..." # change your JWT secret key here
  DB_SECRET_KEY = "..."  # change your DB secret key here
  ENV=production
  ```

## Start the application
### Option 1: Local use
#### Backend
  ```bash
  cd backend                # if you are not in backend folder
  python -m venv venv
  source venv/bin/activate  # On Windows use `venv\Scripts\activate`
  pip install -r requirements.txt
  cd app
  python main.py
  ```
#### Frontend
  ```bash
  cd frontend
  npm install
  ng serve
  ```

### Option 2: Use Docker
- Ensure your are in the root folder `hospitalApp`
- Run docker with this command:
  ```bash
  docker-compose up --build
  ```

## Usage
- Open `https://localhost:4200` in your browser
- Login with default admin by **admin:admin** or register as new user
