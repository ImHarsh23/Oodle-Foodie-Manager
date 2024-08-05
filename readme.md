# Oodle MERN Stack Application

## Overview

The Oodle project is a MERN (MongoDB, Express, React, Node.js) stack application designed for managing restaurant data. It includes user authentication and secure endpoints for restaurant management. The backend uses JWT for security, with features like file uploads via Cloudinary and email notifications through Nodemailer. The frontend is built with React, Redux for state management, and Material Tailwind for styling.

## Features

- **User Management**: Securely manage user accounts.
- **Restaurant Management**: Users can create and manage their own restaurants.
- **Restaurant List**: Retrieve a list of restaurants.
- **File Uploads**: Handle image uploads using Cloudinary.
- **Email Notifications**: Send emails using Nodemailer.
- **JWT Authentication**: Secure API routes with JSON Web Tokens.
- **Frontend**: User-friendly interface with React, Redux, and Material Tailwind.

## Technologies Used

- **Frontend**: React, Redux, Material Tailwind, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Handling**: Cloudinary, Multer
- **Email Service**: Nodemailer
- **Other Libraries**: bcrypt, cors, cookie-parser, hbs, mongoose

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ImHarsh23/Oodle-Foodie-Manager.git
   cd Oodle
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=your_port_number
   DB_USERNAME=your_mongodb_username
   DB_PASS=your_mongodb_password
   DB_NAME=your_mongodb_database_name
   CORS_ORIGINS='["http://localhost:3000"]'
   ACCESS_TOKEN_KEY=your_access_token_key
   ACCESS_TOKEN_EXPIRY=your_access_token_expiry
   REFRESH_TOKEN_KEY=your_refresh_token_key
   REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:your_port_number`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The React application will run on `http://localhost:5173` (or another port if configured differently).

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview the production build:
   ```bash
   npm run preview
   ```

**Schema Middleware:**

- **Cover Image Upload**: The `pre("save")` hook uploads the cover image to Cloudinary before saving the document.
- **Cuisine Categories**: The `pre("save")` hook updates the cuisine categories based on the `cusines` field before saving the document.

### User Schema

The `userSchema` defines the structure of the user data in MongoDB. Key fields include:

- `username`: Required, unique username
- `name`: Required name of the user
- `email`: Required, unique email address
- `image`: URL for the user's image (Cloudinary)
- `avatar`: URL for the user's avatar
- `orderHistory`: Array of past orders with date, item details, and associated restaurant ID
- `cart`: Array of items currently in the user's cart with details and restaurant ID
- `password`: Required password (hashed before saving)
- `refreshToken`: Optional refresh token for JWT

**Schema Methods:**

- `generateRefreshToken`: Generates a JWT refresh token
- `generateAccessToken`: Generates a JWT access token
- `isPasswordCorrect`: Compares the provided password with the hashed password stored in the database

**Schema Middleware:**

- **Password Hashing**: The `pre("save")` hook hashes the password before saving the user document.

## User Restaurant Management

Users can create and manage their own restaurants through the application. This functionality includes:

- **Create Restaurant**: Add a new restaurant by providing details such as name, address, contact information, cover image, and menu.
- **Update Restaurant**: Update the details of their restaurant, including changing the cover image and updating the menu.
- **Delete Restaurant**: Delete their restaurant if necessary.

These operations require user authentication via JWT, ensuring that only authorized users can manage their restaurants.

## Frontend Code

The frontend of the application is built using React and integrates with the backend through API calls. The main entry point for the React application is located in `src/index.jsx`, where it sets up the application with routing, theming, and Redux store.

## Dependencies

The project uses the following dependencies:

- **Backend**:

  - `bcrypt`
  - `cloudinary`
  - `cookie-parser`
  - `cors`
  - `express`
  - `hbs`
  - `jsonwebtoken`
  - `mongoose`
  - `multer`
  - `nodemailer`

- **Frontend**:
  - `@material-tailwind/react`
  - `axios`
  - `react`
  - `react-cookie`
  - `react-dom`
  - `react-hot-toast`
  - `react-redux`
  - `react-router-dom`
  - `redux`
  - `redux-thunk`
  - `vite`
  - `tailwindcss`
  - `eslint`

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests. For issues or feature requests, open a new issue in the [GitHub repository](https://github.com/ImHarsh23/Oodle).

## Contact

For any questions or support, please reach out to [HarshKumar23x@gmail.com](mailto:HarshKumar23x@gmail.com).
