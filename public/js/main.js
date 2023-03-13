function connect() {
  const socket = io("ws://localhost:3000", {
    auth: { sessionID: localStorage.getItem("id") },
  });

  socket.on("user_options", (msg) => {
    console.log(msg);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div>
        ${Object.entries(msg).map(
          ([key, value]) => `<p class="meta">${key}<span>${value}</span></p>`
        )}
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);
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
        ${msg.map(
          ({ id, name, price }) =>
            `<p class="meta">${id}<span>${name} (${price})</span></p>`
        )}
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);
  });

  socket.on("message", (msg) => {
    console.log(msg);
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
      <div>
        ${msg}
      </div>`;

    document.querySelector(".chat-messages").appendChild(div);
  });

  socket.on("current-order", (msg) => {
    console.log(msg);
  });

  socket.on("input must be a number", (data) => {
    console.log(data);
    // const div = document.createElement("div");
    // div.classList.add("message");
    // div.innerHTML =
    //  `
    //   <div>
    //   </div>`;
    // document.querySelector(".chat-messages").appendChild(div);
  });

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // const optionsArr = [1, 97, 99, 98, 0];
    const value = document.getElementById("msg").value;
    // if (typeof value !== "number" && !value.includes(optionsArr)) {
    //   socket.emit("wrong input", value);
    // }
    socket.emit("user-response", value);
  });
}

connect();
