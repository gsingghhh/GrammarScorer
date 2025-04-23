# Grammar Scorer Engine

## Project Overview

The Grammar Scorer Engine is a full-stack web application designed to allow users to upload or record voice inputs, transcribe the audio to text, check the grammar of the transcribed text, and provide a grammar score along with suggestions. The application features user authentication, secure file uploads, and a user-friendly interface to manage and view previous transcriptions.

---

## Project Structure

The project is divided into two main parts:

- **Backend**: Handles API endpoints, user authentication, audio transcription, grammar checking, and data storage.
- **Frontend**: Provides the user interface for login, registration, transcription upload, and viewing results.

---

## Backend

### Overview

The backend is built with Node.js and Express.js, using MongoDB as the database. It provides RESTful API endpoints for user management, audio transcription, and profile management.

### Key Files and Folders

- **`connectDB.js`**: Connects to the MongoDB database using Mongoose.
- **`index.js`**: Entry point of the backend server, sets up middleware, routes, and starts the server.
- **`controllers/`**: Contains controller functions for handling business logic.
  - `user.contoller.js`: Handles user registration, login, and profile retrieval.
  - `file.controller.js`: Handles audio file upload, transcription using Whisper, grammar checking via LanguageTool API, and storing results.
  - `profile.controller.js`: Handles fetching and deleting user transcriptions.
- **`models/`**: Contains Mongoose schemas.
  - `userSchema.js`: Defines the User model with fields like fullName, email, and password.
  - `transcriptionSchema.js`: Defines the Transcription model storing user transcriptions, grammar results, scores, and suggestions.
- **`routes/`**: Defines API routes.
  - `user.routes.js`: Routes for user registration, login, and profile.
  - `file.routes.js`: Routes for audio file upload and transcription.
  - `profile.routes.js`: Routes for managing user transcriptions.
- **`middlewares/`**: Contains middleware functions.
  - `authUser.js`: Middleware to authenticate users using JWT tokens.
- **`uploads/`**: Directory where uploaded audio files and transcription text files are temporarily stored.

### How It Works

1. **User Authentication**: Users register and login. JWT tokens are issued and used to authenticate API requests.
2. **Audio Upload & Transcription**: Authenticated users can upload audio files. The backend uses OpenAI's Whisper model to transcribe audio to text.
3. **Grammar Checking**: The transcribed text is sent to LanguageTool API for grammar checking. The results, including grammar issues and scores, are stored in the database.
4. **Transcription Management**: Users can fetch their previous transcriptions and delete them if needed.

---

## Frontend

### Overview

The frontend is built with React and Vite, providing a responsive and interactive user interface.

### Key Files and Folders

- **`src/main.jsx`**: Entry point of the React application.
- **`src/pages/`**: Contains page components.
  - `UserLogin.jsx`: Login page with form and authentication logic.
  - `UserRegsiter.jsx`: User registration page.
  - `Home.jsx`: Main dashboard page showing user greeting, transcription upload, and previous transcriptions.
- **`src/components/`**:
  - `Logo.jsx`: Displays the application logo.
- **`src/contexts/`**:
  - `UserContext.jsx`: React context to manage and provide user data globally.
- **`public/`**: Static assets.
- **`vite.config.js`**: Vite configuration file.

### How It Works

1. **User Authentication**: Users login or register. JWT tokens are stored in localStorage and managed via UserContext.
2. **Home Page**: Displays a greeting with the user's name, options to record or upload audio, and a list of previous transcriptions.
3. **Audio Upload**: Users can upload audio files which are sent to the backend for transcription and grammar checking.
4. **Transcription Display**: Previous transcriptions are fetched from the backend and displayed with scores and suggestions.

---

## Environment Variables

Both backend and frontend use environment variables for configuration.

- **Backend `.env`**:
  - `MONGO_URI`: MongoDB connection string.
  - `JWT_SECRET_KEY`: Secret key for JWT token signing.
  - Other API keys or secrets as needed.

- **Frontend `.env`**:
  - `VITE_BASE_URL`: Base URL for backend API endpoints.

---

## Installation and Running

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables.
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### User Routes

- `POST /api/user/register`: Register a new user.
- `POST /api/user/login`: Login and receive JWT token.
- `GET /api/user/profile`: Get user profile (requires auth).

### File Routes

- `POST /api/file/audio`: Upload audio file for transcription (requires auth).

### Profile Routes

- `GET /api/profile/transcriptions`: Get all transcriptions for the user (requires auth).
- `DELETE /api/profile/transcriptions/:id`: Delete a transcription by ID (requires auth).

---

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Whisper (OpenAI), LanguageTool API.
- **Frontend**: React, Vite, React Router, Axios, Tailwind CSS, React Context API.

---

## Notes

- Audio transcription uses OpenAI's Whisper model executed via command line.
- Grammar checking is done using the LanguageTool API.
- Authentication is handled via JWT tokens stored in localStorage and sent in Authorization headers.
- File uploads are handled securely with multer middleware.
- The frontend uses React Context to manage user state globally.

---

## Future Improvements

- Add pagination or filtering for previous transcriptions.
- Improve error handling and user feedback.
- Add unit and integration tests.

---

## Contact

For any questions or support, please contact the project maintainer.
