# node-api-signup/node-api-signup/README.md

# Node API Signup

This project is a Node.js application that provides an API for user signup. It accepts user details including a primary key ID, Name, Email, Password, and a profile video with a maximum duration of 30 seconds.

## Project Structure

```
node-api-signup
├── src
│   ├── controllers
│   │   └── signupController.js
│   ├── routes
│   │   └── signupRoutes.js
│   ├── models
│   │   └── userModel.js
│   ├── middlewares
│   │   └── validateVideoDuration.js
│   └── app.js
├── package.json
├── .env
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd node-api-signup
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL=<your-database-url>
SECRET_KEY=<your-secret-key>
```

## Usage

To start the application, run:

```
npm start
```

The API will be available at `http://localhost:3000/api/signup`.

## API Endpoint

### POST /api/signup

#### Request Body

- `id`: Primary key ID (string)
- `name`: User's name (string)
- `email`: User's email (string)
- `password`: User's password (string)
- `profileVideo`: Profile video file (must not exceed 30 seconds)

#### Response

- `201 Created`: User successfully signed up.
- `400 Bad Request`: Validation errors or video duration exceeds limit.

## License

This project is licensed under the MIT License.