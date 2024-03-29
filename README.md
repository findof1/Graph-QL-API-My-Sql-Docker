# Graph QL Testing API

## Introduction

This project is a Node.js application, made by Findof, that serves as a GraphQL server interacting with a MySQL database. It provides a GraphQL API for querying and mutating data stored in the MySQL database. This project can be used for testing, for learning, or as a reference if you are building a GraphQL API. It utilizes technologies such as Node.js, GraphQL, and MySQL.

## Prerequisites

- Docker
- Docker Compose

## Installation

1. **Copy all files into a directory**: Ensure you have a local copy of all project files.

2. **Open a terminal**: Use Git Bash, Windows PowerShell, or your preferred terminal in your project directory.

3. **Verify Docker installation**: Run `docker --version` and `docker-compose --version` to ensure Docker and Docker Compose are installed.

4. **Setup MySQL passwords**: Go to the `.env` file and the `docker-compose.yml` file and edit the `MYSQL_PASSWORD` (in the `.env` and `docker-compose` files) and the `MYSQL_ROOT_PASSWORD` (in the `docker-compose` file) fields to a selected password (both passwords have to be the same).

5. **Build and run the Docker containers**: Navigate to the root directory of the project where the `docker-compose.yml` file is located and execute `docker-compose up --build` to build the Docker images and start the containers.

6. **Access the API**: Once the containers are up, you can access the GraphQL API at `http://localhost:8000/graphql`.

## Usage

To use, you can use the fetch API in a separate front-end, or you can use an HTTP request tool like Postman or Insomnia. As an alternative, you can set up GraphiQL inside of this project. 

Example GraphQL query:

graphql query { allFood { id food_name } }

Example GraphQL mutation:

graphql mutation { addFood(food_name: "Pizza", chefId: 1, restaurantId: 1) { id food_name } }

## Troubleshooting

If you are receiving unknown errors, ensure that your `.env` and `docker-compose.yml` files have the same/correct MySQL password. For more common issues and their solutions, refer to the FAQ section or contact the project maintainers.
