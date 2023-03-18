# HOT SAUCE RESTUARANT CHATBOT

---

## Description

Hot Sauce Restuarant Chatbot is a chatbot application that assists customers in placing orders for their preferred meals.

## How To Use

---

- Select 1 to Place an order.
- To place your order, enter the number preceding the items you want to order. For example:
  - Select 2 for Pizza
  - Select 3 for Rice
  - Select 4 for Chicken
  - Select 5 for Salad
- Select 99 to checkout order.
- Select 98 to see order history.
- Select 97 to see current order.
- Select 0 to cancel order.

```
NOTE: Multiple items can be ordered
```

---

# Tech Stack

---

## 1. Main Dependencies

- **node.js** and **express** as the JavaScript runtime environment and server framework.
- **mongodb** as a database of choice.
- **mongoose** as an ODM library of choice.
- **socket.io** as a WebSocket library of choice.
- **express-session**- simple session middleware for Express

---

## Getting Started Locally

### Prerequisites & Installation

To be able to get this application up and running, ensure to have node installed on your device.

### Development Setup

1.  #### Download the project locally by forking this repo and then clone or just clone directly via:

> git clone https://github.com/Anosike-Prosper/CHATRIO.git

2.  #### Create a .env file just like the example.env

    - Create a `SECRET` variable and assign a Session Secret.
    - Create a `PORT` variable and assign a port value (preferably 5005)

3.  #### Set up the Database

    - Create a MongoDB database on your local MongoDB server or in the cloud (Atlas).
    - Copy the connection string and assign it to the `MONGO_URL` environment variable.

    - On connection to the database, two collections - OrdelModel, OrderModelItem are created.

# Models

---

### OrderModel

| Fields     | Data     | Constraints types                                             |     |
| ---------- | -------- | ------------------------------------------------------------- | --- |
| userid     | String   | required                                                      |
| status     | String   | enum: ["completed","pending","cancelled"], default: "pending" |
| amount     | Number   | required, default: 0                                          |
| timestamps | DateTime | true                                                          |

### OrderItemModel

| Fields     | Data types                     | Constraints |
| ---------- | ------------------------------ | ----------- |
| userid     | String                         | required    |
| orderid    | mongoose.Schema.Types.ObjectId | ref:"Order" |
| itemid     | String                         | required    |
| itemname   | String                         | required    |
| price      | Number                         | required    |
| timestamps | DateTime                       | true        |

---

## Setup

---

To install all packages, use `npm install`

- run: `npm run start` (for production)
- run: `npm run dev` (for development)

---

### Base Url

- [Go to this link](https://restaurant-chatbot-0z6e.onrender.com/)

---

# Contributor

- **Anosike Prosper**
