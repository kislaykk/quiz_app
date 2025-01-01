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
   git clone <repository-url>
   cd <project-directory>

