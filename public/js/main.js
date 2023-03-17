function connect() {
  const socket = io(`wss://${window.location.host}`, {
    auth: { sessionID: localStorage.getItem("id") },
  });

  socket.on("user_options", (msg) => {
    console.log(msg);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div>
        <div class="meta">Here are the possible commands you can do...</div>
        <div class="list">
          ${Object.entries(msg)
            .map(
              ([key, value]) =>
                `<div class="list-item"><span>${key}</span>${value}</div>`
            )
            .join("\n")}
        </div>
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);

    scrollToView();
  });

  socket.on("session", (data) => {
    const { id } = data;
    socket.auth = { sessionID: id };
    console.log(data);
    localStorage.setItem("id", id);
  });

  socket.on("order-list", (msg) => {
    console.log(msg);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div>
        <div class="meta">Here is the order list...</div>
        <div class="list">
          ${msg
            .map(
              ({ id, name, price }) =>
                `<p class="list-item"><span>${id}</span> ${name} (${price}) </p>`
            )
            .join("\n")}
        </div>
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);

    scrollToView();
  });

  socket.on("message", (msg) => {
    displayMessage(msg);
    scrollToView();
  });

  socket.on("current-order", (msg) => {
    displaySingleOrder(msg);
    scrollToView();
  });

  socket.on("order-history", (msg) => {
    displayOrderHistory(msg);
    scrollToView();
  });

  function displayMessage(msg) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div>
        ${msg}
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);
  }

  function displayUserInput(msg) {
    const div = document.createElement("div");
    div.classList.add("message", "self");
    div.innerHTML = `
      <div>
        ${msg}
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);
  }

  function displaySingleOrder(order) {
    console.log(order);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div class="orders">
        Current Order:
        <div class="order-item">
          ${
            order.items.length === 0
              ? `<div>There are currently no items in this order.</div>`
              : order.items.map(
                  (item) =>
                    `<div class="details">${item.itemname} - ${item.price}</div>`
                )
          }
        </div>
        <div class="total">
          Total: ${order.amount}
        </div>
      </div>
    `;

    document.querySelector(".chat-messages").appendChild(div);
  }

  function displayOrderHistory(msgs) {
    console.log(msg);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div class="orders">
        Order History

        <div class="order-items">
          ${msgs
            .map(
              (order) =>
                `<div classname="order-item">
              Order #${order._id}
              <div class="">
                ${order.items
                  .map(
                    (item) =>
                      `<div class="details">${item.itemname} - ${item.price}</div>`
                  )
                  .join("")}
              </div>
              <div class="total">Total: ${order.amount}</div>
            </div>`
            )
            .join("\n")}
        </div>
      </div>
    `;

    document.querySelector(".chat-messages").appendChild(div);
  }

  function scrollToView() {
    const messageBox = document.getElementsByClassName("chat-messages")[0];
    messageBox.scrollTo(0, messageBox.getClientRects()[0]["bottom"]);
  }

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = Number.parseInt(document.getElementById("msg").value);
    if (typeof value !== "number") {
      return displayMessage("invalid input");
    }

    displayUserInput(value);
    socket.emit("user-response", value);
    scrollToView();
  });
}

connect();
