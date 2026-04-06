# Finance Data Processing and Access Control Backend

A robust backend system for managing financial records with Role-Based Access Control (RBAC).

## Features

- **User & Role Management**: Register, login, and manage user statuses.
- **RBAC**: Three roles: `Viewer`, `Analyst`, and `Admin`.
- **Financial Records**: CRUD operations for transactions with filtering.
- **Dashboard Summary**: Aggregated data for income, expenses, and trends.
- **Swagger Documentation**: Interactive API documentation.
- **Secure**: Password hashing with bcrypt and JWT authentication.

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Swagger UI & OpenAPI 3.0
- dotenv, cors

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed or a MongoDB Atlas account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

### API Documentation

Once the server is running, visit: `http://localhost:5000/api-docs`

## Role Capabilities

- **Viewer**: View records.
- **Analyst**: View records, create records, update records, view dashboard summary.
- **Admin**: Full access (CRUD users, CRUD all records, view summary).

## Deployment

This project is configured for deployment on Vercel. Ensure you set the environment variables in the Vercel dashboard.
