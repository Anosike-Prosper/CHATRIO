# RESTUARANT CHATBOT

---

### Funtionalities

---

<ul>
 <li>Select 1 to Place an order</li>
<li> Select 99 to checkout order</li>
<li>Select 98 to see order history</li>
<li> Select 97 to see current order</li>
<li>Select 0 to cancel order</li>

</ul>

---

### Setup

---

- To install all packages, use `npm install`
- Pull this repo
- Update env file with .env

- run: `npm run start` (for production)
- run: `npm run dev` (for development)

---

### Base Url

- [Go to this link](https://wandering-cap-clam.cyclic.app/)

---

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

# Contributor

- **Anosike Prosper**
