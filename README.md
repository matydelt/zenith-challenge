# Project Setup

## Requirements
- [Docker](https://www.docker.com/)

## How to Run
Execute the following command in the project folder:
```sh
docker-compose up --build
```

---

# API Endpoints

## Create an Order
**Method:** `POST`
**Path:** `/orders`

### Request Body:
```json
{
  "userId": "12345",
  "products": [
    {
      "productId": "p1",
      "quantity": 1
    }
  ]
}
```

### Response:
```json
{
  "orderId": "67bc17fb4e2aa0314f14b6b7",
  "status": "PROCESSING"
}
```

### Description:
Creates a new order and sends it to a worker for further processing.

---

## Get Order Details
**Method:** `GET`
**Path:** `/orders/:orderId`

### Parameters:
- `orderId` (Path Parameter)

### Response:
```json
{
  "orderId": "67bc1782297a203ba6c07fbc",
  "userId": "12345",
  "products": [
    {
      "productId": "p1",
      "quantity": 1
    },
    {
      "productId": "p2",
      "quantity": 2
    }
  ],
  "status": "COMPLETED"
}
```

---

## Retrieve Order Logs
**Method:** `GET`
**Path:** `/logs/orders/:orderId`

### Parameters:
- `orderId` (Path Parameter)

### Response:
```json
[
  {
    "timestamp": "2025-02-24T06:55:55.913Z",
    "orderId": "67bc17fb4e2aa0314f14b6b7",
    "message": "✅ Order processed successfully with status: COMPLETED"
  },
  {
    "timestamp": "2025-02-24T06:55:55.897Z",
    "orderId": "67bc17fb4e2aa0314f14b6b7",
    "message": "Order sent to queue"
  },
  {
    "timestamp": "2025-02-24T06:55:55.893Z",
    "orderId": "67bc17fb4e2aa0314f14b6b7",
    "message": "Order 67bc17fb4e2aa0314f14b6b7 created for user: 12345"
  }
]
```

---

## Notes
- A Postman collection with request examples is available in the project folder under `zenith-challenge`.

