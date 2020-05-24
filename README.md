# Serverless TODO

- A serverless TODO web application using AWS Lambda and Serverless framework. This application is developed alongside the [Udacity Cloud Engineering Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990). It allows users to register and log into a web client, create/update todos to the feed, and also attach image to any todo item.

## Functionality of the application

- This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

## TODO items

The application stores TODO items, and each TODO item contains the following fields:

- `todoId` ***(string)*** - a unique id for an item.
- `createdAt` ***(string)*** - date and time when an item was created.
- `name` ***(string)*** - name of a TODO item (e.g. "Change a light bulb").
- `dueDate` ***(string)*** - date and time by which an item should be completed.
- `done` ***(boolean)*** - true if an item was completed, false otherwise.
- `attachmentUrl` ***(string)*** *(optional)* - a URL pointing to an image attached to a TODO item.

It also stores an id of a user who created a TODO item.

## Functions Implemented

- `Auth` - This function implements a custom authorizer for API Gateway that should be added to all other functions by Fetch a certificate from Auth0 instead of hard coding it in an authorizer.

- `GetTodos` - This function returns all TODOs for a current user. A user id can be extracted from a ***JWT*** token that is sent by the Front-End.

  It returns data that looks like this:

  ```json
  {
    "items": [
      {
        "todoId": "123",
        "createdAt": "2019-07-27T20:01:45.424Z",
        "name": "Buy milk",
        "dueDate": "2019-07-29T20:01:45.424Z",
        "done": false,
        "attachmentUrl": "http://example.com/image.png"
      },
      {
        "todoId": "456",
        "createdAt": "2019-07-27T20:01:45.424Z",
        "name": "Send a letter",
        "dueDate": "2019-07-29T20:01:45.424Z",
        "done": true,
        "attachmentUrl": "http://example.com/image.png"
      },
    ]
  }
  ```

- `CreateTodo` - This function creates a new TODO for a current user. A shape of data send by a client application to this function can be found in the `CreateTodoRequest.ts` file

  It receives a new TODO item to be created in JSON format that looks like this:

  ```json
  {
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy milk",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
  ```

  And it returns a new TODO item that looks like this:

  ```json
  {
    "item": {
      "todoId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Buy milk",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    }
  }
  ```

- `UpdateTodo` - This function updates a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file

  It receives an object that contains three fields that can be updated in a TODO item:

  ```json
  {
    "name": "Buy bread",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": true
  }
  ```

  The `id` of an item that should be updated is passed as a URL parameter. And it returns an empty body.

- `DeleteTodo` - This function deletes a TODO item created by a current user. Expects an id of a TODO item to remove.
  It returns an empty body.

- `GenerateUploadUrl` - This function returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

  It returns a JSON object that looks like this:

  ```json
  {
    "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
  }
  ```

*Note*: All functions are connected to appropriate events from ***API Gateway***. And an `id` of a user can be extracted from a JWT token passed by a client.

## Frontend

- The `client` folder contains a web application that can use the API that are developed in the project.

## Logging

- The application uses [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements.

## How to run the application

### Backend

- To deploy the application run the following commands:

```shell
cd backend
npm install
sls deploy -v
```

### Frontend

- To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```shell
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

## Postman Collection

- An alternative way to test the API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this repository root directory.

## Technologies

- [Amazon Lambda](https://aws.amazon.com/lambda/)
- [Serverless Framework](https://serverless.com/)
- [Amazon API Gateway](https://aws.amazon.com/api-gateway/)
- [Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/)
- [Amazon Simple Cloud Storage Service (S3)](https://aws.amazon.com/s3/)
- [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/)
- [Amamzon CloudFormation](https://aws.amazon.com/cloudformation/)
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
