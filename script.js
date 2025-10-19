const MAX_USERS = 20;
const users = [];
const container = document.getElementById("container");

// Sumber event dari serverless API (SSE)
const eventSource = new EventSource("/api/event");

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  addUser(data.type, data.username, data.avatar, data.value);
};

function addUser(type, username, avatar, value = 0) {
  // Jika user sudah tampil, abaikan
  if (users.find(u => u.username === username)) return;

  // Jika sudah 20 user, hapus yang pertama
  if (users.length >= MAX_USERS) {
    const old = users.shift();
    old.el.remove();
  }

  const el = document.createElement("img");
  el.src = avatar;
  el.classList.add("avatar", type);

  let size = 50;
  if (type === "tap") size = 70;
  if (type === "gift") {
    if (value >= 1000) size = 140;
    else if (value >= 100) size = 100;
    else size = 80;
  }
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;

  el.style.left = `${Math.random() * 90}vw`;
  el.style.top = `${Math.random() * 80}vh`;

  const moveX = `${Math.random() * 200 - 100}px`;
  const moveY = `${Math.random() * 200 - 100}px`;
  el.style.setProperty("--move-x", moveX);
  el.style.setProperty("--move-y", moveY);
  el.style.animationDuration = `${4 + Math.random() * 6}s`;

  container.appendChild(el);
  users.push({ username, el });
}
