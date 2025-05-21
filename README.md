# Voting App (MERN Stack)

A full-stack JavaScript voting application built with the MERN (MongoDB, Express.js, React, Node.js) stack. This project is developed as part of coding interview preparation, implementing key features of a real-world voting platform.

## Table of Contents

- [Voting App (MERN Stack)](#voting-app-mern-stack)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [User Stories](#user-stories)
  - [Technologies Used](#technologies-used)
  - [Features Implemented](#features-implemented)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [Future Enhancements](#future-enhancements)
  - [License](#license)

## Project Overview

This application allows users to create, vote on, and view results for polls. It distinguishes between authenticated users (who can manage their own polls) and unauthenticated users (who can only view and vote on existing polls). The goal is to demonstrate full-stack development skills, including database management, API creation, user authentication, and a responsive frontend.

## User Stories

The following user stories are implemented in this project:

* **Authenticated User:**
    * Can keep my polls and come back later to access them.
    * Can share my polls with my friends.
    * Can see the aggregate results of my polls.
    * Can delete polls that I decide I don't want anymore.
    * Can create a poll with any number of possible items.
    * If I don't like the options on a poll, I can create a new option.
* **Unauthenticated or Authenticated User:**
    * Can see and vote on everyone's polls.
    * Can see the results of polls in chart form (e.g., Chart.js or Google Charts).

## Technologies Used

* **Frontend:**
    * [React](https://react.dev/) (JavaScript library for building user interfaces)
    * [Chart.js](https://www.chartjs.org/) (for displaying poll results) - *To be integrated*
    * [Axios](https://axios-http.com/) (for making HTTP requests) - *To be integrated*
* **Backend:**
    * [Node.js](https://nodejs.org/) (JavaScript runtime environment)
    * [Express.js](https://expressjs.com/) (Web framework for Node.js)
    * [Mongoose](https://mongoosejs.com/) (MongoDB object modeling for Node.js) - *To be integrated*
    * [Passport.js](http://www.passportjs.org/) (Authentication middleware for Node.js) - *To be integrated*
    * [jsonWebToken](https://jwt.io/) (for stateless authentication) - *To be integrated*
* **Database:**
    * [MongoDB](https://www.mongodb.com/) (NoSQL document database)
* **Tools & Other:**
    * [Git](https://git-scm.com/)
    * [GitHub](https://github.com/)
    * [VS Code](https://code.visualstudio.com/)

## Features Implemented

*(This section will be updated as features are built)*

* Basic MERN stack setup
* User Registration & Login (Planned)
* Poll Creation (Planned)
* Voting Mechanism (Planned)
* Dynamic Charting of Results (Planned)
* Poll Management (Edit/Delete) (Planned)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* Git
* MongoDB (running locally or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/voting-app-mern.git](https://github.com/YOUR_USERNAME/voting-app-mern.git)
    cd voting-app-mern
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

### Running the Application

1.  **Set up environment variables:**
    * In the `server` directory, create a `.env` file:
        ```
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=a_very_secret_key_for_jwt
        ```
        *(Replace `your_mongodb_connection_string` with your MongoDB URI. For local MongoDB, it might be `mongodb://localhost:27017/votingapp`)*
    * In the `client` directory, create a `.env` file:
        ```
        REACT_APP_API_URL=http://localhost:5000/api
        ```
        *(We will set up the proxy in `package.json` for development later, but this is good for build and other uses)*

2.  **Start the backend server:**
    ```bash
    cd server
    node server.js # or `nodemon server.js` if you install nodemon
    cd ..
    ```
    The server will run on `http://localhost:5000`.

3.  **Start the frontend development server:**
    ```bash
    cd client
    npm start
    cd ..
    ```
    The React app will open in your browser on `http://localhost:3000`.

## Project Structure

voting-app-mern/
├── client/                 # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── server/                 # Node.js/Express backend API
│   ├── node_modules/
│   ├── package.json
│   ├── server.js           # Main server file
│   ├── .env.example        # Example env file (don't commit actual .env)
│   └── ...
├── .gitignore              # Git ignore file for the root project
├── README.md               # Project documentation
└── package.json            # Root level package.json (optional, but good for scripts)


## Future Enhancements

* Real-time updates for poll results using WebSockets (Socket.IO).
* User profile management.
* More advanced sharing options.
* Filtering and searching polls.
* Admin dashboard.
* Deployment scripts.

## License

This project is open source and available under the [MIT License](LICENSE).
*(You'll need to create a `LICENSE` file if you want to include one. For interview prep, often not strictly necessary unless specified, but good practice.)*