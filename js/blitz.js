const API_URL = "https://gamify-life-psi.vercel.app";
const table = document.getElementById("blitzTable").querySelector("tbody");
const today = new Date().toLocaleDateString();
let goals = [];

async function loadUserData() {
  try {
    const headers = { "X-User-ID": currentUser ? currentUser.uid : "guest" };
    const [gRes, bRes] = await Promise.all([
      fetch(`${API_URL}/api/goals`, { headers }),
      fetch(`${API_URL}/api/blitz`, { headers })
    ]);
    goals = await gRes.json();
    const tasks = await bRes.json();
    table.innerHTML = "";
    tasks.forEach(t => addRow(t));
  } catch (e) { console.error(e); }
}

async function saveBlitz() {
  const tasks = Array.from(table.rows).map(r => ({
    task: r.cells[2].textContent.trim(),
    completed: r.cells[1].querySelector("input").checked,
    date: r.cells[0].textContent,
    category: r.cells[3].querySelector("select").value,
    subcategory: r.cells[4].querySelector("select").value
  }));
  await fetch(`${API_URL}/api/blitz`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-ID": currentUser ? currentUser.uid : "guest" },
    body: JSON.stringify(tasks)
  });
}

function addBlitz() {
  const input = document.getElementById("newTask");
  const task = input.value.trim();
  if (!task) return;
  addRow({ task, completed: true, date: today, category: "", subcategory: "" });
  input.value = ""; input.focus();
  saveBlitz();
}

function addRow(t) {
  const row = table.insertRow();
  const catOpts = goals.map(z => `<option value="${z.name}" ${z.name===t.category?"selected":""}>${z.name}</option>`).join("");
  const subOpts = goals.flatMap(z => z.subs.map(s => s.name)).map(s => `<option ${s===t.subcategory?"selected":""}>${s}</option>`).join("");

  row.innerHTML = `
    <td>${t.date}</td>
    <td><input type="checkbox" ${t.completed?"checked":""} onchange="toggle(this)"></td>
    <td contenteditable="true" onblur="saveBlitz()">${t.task}</td>
    <td><select onchange="saveBlitz()" class="blitz__select"><option value="">—</option>${catOpts}</select></td>
    <td><select onchange="saveBlitz()" class="blitz__select"><option value="">—</option>${subOpts}</select></td>
    <td class="xp-cell">${t.completed?"5":"0"}</td>
    <td><button class="blitz__delete-btn" onclick="this.closest('tr').remove();saveBlitz()">Delete</button></td>
  `;
  if (t.completed) row.classList.add("completed");
}

function toggle(cb) {
  const row = cb.closest("tr");
  row.querySelector(".xp-cell").textContent = cb.checked ? "5" : "0";
  row.classList.toggle("completed", cb.checked);
  saveBlitz();
}

document.getElementById("newTask").addEventListener("keypress", e => e.key==="Enter" && addBlitz());