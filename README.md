# Project Name

## Description
This is an Express.js application that uses PostgreSQL as a database. It uses Sequelize as the ORM to manage database models and migrations. The application also includes unit testing using Mocha and Sinon.

---

## Dependencies

### `dependencies`
- **body-parser**: ^1.20.3  
  Middleware to parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.

- **celebrate**: ^15.0.3  
  A validation library for Express.js that integrates with Joi, making it easy to validate requests.

- **express**: ^4.21.2  
  The web framework for Node.js to build RESTful APIs.

- **pg**: ^8.13.1  
  A PostgreSQL client for Node.js.

- **pg-hstore**: ^2.3.4  
  A library for serializing and deserializing JSON data to store in PostgreSQL.

- **sequelize**: ^6.37.5  
  A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.

### `devDependencies`
- **mocha**: ^11.0.1  
  A testing framework for Node.js, which provides a flexible and feature-rich environment for running tests.

- **sequelize-cli**: ^6.6.2  
  A command-line tool for running database migrations and managing Sequelize models.

- **sinon**: ^19.0.2  
  A library for creating spies, mocks, and stubs for unit testing.

---

## How to Run the Application with Docker

### Prerequisites
Ensure that you have Docker and Docker Compose installed on your machine.

### Steps to Run

1. **Clone the repository**:
   If you haven't already, clone the repository to your local machine:
   ```bash
   git clone https://github.com/kislaykk/quiz_app.git
   cd quiz_app

2. **Build the Docker containers**:
   Build the Docker containers using Docker Compose:
   ```bash
   docker-compose build

3. **Start the containers**:
   Start the application and PostgreSQL containers:
   ```bash
   docker-compose up

After this the application will be accessible in http://localhost:3000

please use the post man collection *Quiz App.postman_collection.json* to play around!!! 

### Known Issues
currently we dont have anu validation layer , we are simply checking if the submission is made by a user(with userid headers)


# Quiz App API Documentation

## Base URL
`http://localhost:3000`

---

## Endpoints

### 1. **Get Quiz**

- **Endpoint:** `GET /quiz/:quizId`
- **Description:** Retrieves a specific quiz by its ID.
- **Request Example:**
  - URL: `http://localhost:3000/quiz/3`
  - Method: `GET`
- **Response:** 
  - Returns the details of the quiz with ID `3`.

---

### 2. **Create Quiz**

- **Endpoint:** `POST /quiz`
- **Description:** Creates a new quiz with a title and questions.
- **Request Example:**
  - URL: `http://localhost:3000/quiz`
  - Method: `POST`
  - Request Body:
    ```json
    {
      "title": "difficult quiz part 2",
      "questions": [
        {
          "text": "what is the ninth plane?",
          "options": [
            "God Knows",
            "Mars",
            "Europa",
            "None"
          ],
          "correct_option": 4
        },
        {
          "text": "what is the third plane?",
          "options": [
            "Jupiter",
            "Mars",
            "Europa",
            "None"
          ],
          "correct_option": 2
        }
      ]
    }
    ```
- **Response:** 
  - Returns the created quiz object with the assigned `quizId`.

---

### 3. **Submit Answer**

- **Endpoint:** `POST /quiz/:quizId/question/:questionId`
- **Description:** Submits a selected answer for a specific question in a quiz.
- **Request Example:**
  - URL: `http://localhost:3000/quiz/22/question/4`
  - Method: `POST`
  - Headers:
    - `userId`: `qwerty`
  - Request Body:
    ```json
    {
      "selectedOption": 1
    }
    ```
- **Response:**
  - Returns the result of the answer submission (correct/incorrect).

---

### 4. **Get Results**

- **Endpoint:** `GET /quiz/:quizId/results`
- **Description:** Retrieves the results for a specific quiz for a given user.
- **Request Example:**
  - URL: `http://localhost:3000/quiz/29/results`
  - Method: `GET`
  - Headers:
    - `userId`: `qwerty`
- **Response:**
  - Returns the results of the quiz with `quizId` `29` for the user `qwerty`.

---

## Authentication

- Some requests require a `userId` to be included in the headers for identifying the user. For example:
  ```plaintext
  userId: qwerty
