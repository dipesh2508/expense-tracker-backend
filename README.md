# Personal Finance Tracker Backend

This is the backend for a personal finance tracker application built with Node.js, Express, and MongoDB.

## Setup

### Prerequisites

- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dipesh2508/expense-tracker-backend
   cd expense-tracker-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:

   ```env
   PORT=8000
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Run the server

   ```bash
   npm run dev

   The server will start on http://localhost:8000
   ```

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cors](https://www.npmjs.com/package/cors)


## API Endpoints

### Auth

Register a new user

Endpoint: POST `/api/auth/signup`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "<access-token>"
}
```

Login

Endpoint: POST `/api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "<access-token>"
}
```

### Categories

Get all categories

Endpoint: GET `/api/categories`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Response:

```json
[
  {
    "_id": "60d21b4667d0d8992e610c86",
    "name": "Food",
    "user": "60d21b4667d0d8992e610c84",
    "createdAt": "2023-06-25T14:28:14.437Z",
    "updatedAt": "2023-06-25T14:28:14.437Z",
    "__v": 0
  }
]
```

Add a new category

Endpoint: POST `/api/categories`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Request body:

```json
{
  "name": "Food"
}
```

Response:

```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Food",
  "user": "60d21b4667d0d8992e610c84",
  "createdAt": "2023-06-25T14:28:14.437Z",
  "updatedAt": "2023-06-25T14:28:14.437Z",
  "__v": 0
}
```

Update a category

Endpoint: PUT `/api/categories/:id`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Request body:

```json
{
  "name": "Groceries"
}
```

Response:

```json
{
  "_id": "60d21b4667d0d8992e610c86",
  "name": "Groceries",
  "user": "60d21b4667d0d8992e610c84",
  "createdAt": "2023-06-25T14:28:14.437Z",
  "updatedAt": "2023-06-25T14:28:14.437Z",
  "__v": 0
}
```

Delete a category

Endpoint: DELETE `/api/categories/:id`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Response:

```json
{
  "message": "Category removed"
}
```

### Expenses

Get all expenses

Endpoint: GET `/api/expenses`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Response:

```json
[
  {
    "_id": "60d21b4667d0d8992e610c85",
    "description": "Grocery shopping",
    "amount": 50,
    "date": "2023-06-25T00:00:00.000Z",
    "category": "60d21b4667d0d8992e610c86",
    "user": "60d21b4667d0d8992e610c84",
    "createdAt": "2023-06-25T14:28:14.437Z",
    "updatedAt": "2023-06-25T14:28:14.437Z",
    "__v": 0
  }
]
```

Add a new expense

Endpoint: POST `/api/expenses`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Request body:

```json
{
  "description": "Dinner",
  "amount": 30,
  "date": "2023-06-25",
  "category": "60d21b4667d0d8992e610c86"
}
```

Response:

```json
{
  "_id": "60d21b4667d0d8992e610c87",
  "description": "Dinner",
  "amount": 30,
  "date": "2023-06-25T00:00:00.000Z",
  "category": "60d21b4667d0d8992e610c86",
  "user": "60d21b4667d0d8992e610c84",
  "createdAt": "2023-06-25T14:28:14.437Z",
  "updatedAt": "2023-06-25T14:28:14.437Z",
  "__v": 0
}
```

Update an expense

Endpoint: PUT `/api/expenses/:id`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Request body:

```json
{
  "description": "Dinner at a restaurant",
  "amount": 45
}
```

Response:

```json
{
  "_id": "60d21b4667d0d8992e610c87",
  "description": "Dinner at a restaurant",
  "amount": 45,
  "date": "2023-06-25T00:00:00.000Z",
  "category": "60d21b4667d0d8992e610c86",
  "user": "60d21b4667d0d8992e610c84",
  "createdAt": "2023-06-25T14:28:14.437Z",
  "updatedAt": "2023-06-25T14:28:14.437Z",
  "__v": 0
}
```

Delete an expense

Endpoint: DELETE `/api/expenses/:id`

Headers:

```json
{
  "x-auth-token": "<access-token>"
}
```

Response:

```json
{
  "message": "Expense removed"
}
```

## Error Handling

- The API endpoints handle common errors such as validation errors, authentication failures, and database errors.
- Responses include appropriate HTTP status codes and error messages for clarity.

## Authentication

- JWT (JSON Web Token) is used for authentication. Include the x-auth-token header with JWT token in requests to authenticated routes.