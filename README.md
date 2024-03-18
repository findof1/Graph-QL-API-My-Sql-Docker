# Graph QL Testing API

## Introduction

This project is a Node.js application that serves as a GraphQL server interacting with a MySQL database. It provides a GraphQL API for querying and mutating data stored in the MySQL database.
This project can be used for testing, for learning, or as a reference if you are building a GraphQL api.

## Prerequisites

- Docker
- Docker Compose

## Installation

1. **Copy all files into a directory**: Ensure you have a local copy of all project files.

2. **Open a terminal**: Use Git Bash, Windows PowerShell, or your preferred terminal in your project directory.

3. **Verify Docker installation**: Run `docker --version` and `docker-compose --version` to ensure Docker and Docker Compose are installed.

4. **Build and run the Docker containers**: Execute `docker-compose up --build` to build the Docker images and start the containers.

5. **Access the API**: Once the containers are up, you can access the GraphQL API at `http://localhost:8000/graphql`.

## Usage

To use, you can use the fetch api in a seperate front-end, or you can use a http request tool like Postman or Insomnia. As an alternative you can setup Graphiql inside of this project. 

## Troubleshooting

If you are recieving unknown errors, ensure that your .env file and dockerfile have the correct mysql setup.
