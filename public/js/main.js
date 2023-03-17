function connect() {
  let address = `ws://localhost:5005`;
  if (process.env.ENV === "production") {
    address = `wss://${window.location.host}`;
  }

  const socket = io(address, {
    auth: { sessionID: localStorage.getItem("id") },
  });

  socket.on("user_options", (msg) => {
    console.log(msg);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div>
        <div class="meta">here are the possible commands you can do...</div>
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
      <div>
        Current Order:
        <div>
          ${order.items.map(
            (item) => `<div>${item.itemname} - ${item.price}</div>`
          )}
        </div>
        <div>
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
      <div>
        Order History

        <div>
          ${msgs
            .map(
              (order) =>
                `<div>
              Order #${order._id}
              <div>
                ${order.items
                  .map((item) => `<div>${item.itemname} - ${item.price}</div>`)
                  .join("\n")}
              </div>
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
    messageBox.scrollTo(0, messageBox.getBoundingClientRect().height);
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
