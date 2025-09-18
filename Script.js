const socket = io();
let player = 0;
let room = null;
let cells = Array(9).fill(null);

const board = document.getElementById("board");
const status = document.getElementById("status");
const info = document.getElementById("info");

function joinRoom() {
  room = document.getElementById("roomInput").value.trim();
  if (!room) return alert("نام اتاق لازم است!");
  socket.emit("joinRoom", room);
  info.innerText = "اتاق: " + room;
}

socket.on("playerNumber", n => {
  player = n;
  info.innerText += ` | شما بازیکن ${player}`;
});

socket.on("start", () => {
  status.innerText = "بازی شروع شد!";
  render();
});

socket.on("move", ({ index, symbol }) => {
  cells[index] = symbol;
  render();
});

function render() {
  board.innerHTML = "";
  cells.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.innerText = c || "";
    div.onclick = () => makeMove(i);
    board.appendChild(div);
  });
}

function makeMove(i) {
  if (cells[i]) return;
  const s = player === 1 ? "❌" : "⭕";
  cells[i] = s;
  socket.emit("move", { index: i, symbol: s, room: room });
  render();
}
