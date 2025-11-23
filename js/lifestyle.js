// js/lifestyle.js
const API_URL = "https://gamify-life-psi.vercel.app";
const container = document.getElementById("zones");

async function loadUserData() {
  try {
    const headers = { "X-User-ID": currentUser ? currentUser.uid : "guest" };
    const res = await fetch(`${API_URL}/api/goals`, { headers });
    let data = await res.json();
    if (!data || data.length === 0) {
      data = defaultData();
      await save(data);
    }
    render(data);
  } catch (e) {
    console.error(e);
    render(defaultData());
  }
}

async function save(data) {
  await fetch(`${API_URL}/api/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": currentUser ? currentUser.uid : "guest"
    },
    body: JSON.stringify(data)
  });
}

function render(data) {
  container.innerHTML = "";
  data.forEach((zone, zi) => {
    const div = document.createElement("div");
    div.className = "lifestyle__zone";
    div.style.borderLeftColor = zone.color;

    div.innerHTML = `
      <div class="lifestyle__zone-header">
        <h2 class="lifestyle__zone-title" style="color:${zone.color}" contenteditable="false">${zone.name}</h2>
        <button class="lifestyle__edit-btn" onclick="toggleEdit(${zi})">Edit</button>
        <input type="color" class="lifestyle__color-picker" value="${zone.color}" onchange="updateColor(${zi}, this.value)">
      </div>
      <div class="lifestyle__map-zone">
        Map Zone: <span contenteditable="false">${zone.mapZone || "Click edit to set"}</span>
      </div>

      <table class="lifestyle__table">
        <thead><tr><th>#</th><th>Sub-Category</th><th>2026 Goal</th><th>Track</th><th>Result</th><th></th></tr></thead>
        <tbody>
          ${zone.subs.map((s,i) => `
            <tr>
              <td class="num">${s.num}</td>
              <td contenteditable="true" onblur="updateSub(${zi},${i},'name',this.textContent)">${s.name}</td>
              <td contenteditable="true" onblur="updateSub(${zi},${i},'goal',this.textContent)">${s.goal}</td>
              <td contenteditable="true" onblur="updateSub(${zi},${i},'track',this.textContent)">${s.track}</td>
              <td contenteditable="true" onblur="updateSub(${zi},${i},'result',this.textContent)">${s.result}</td>
              <td><button class="lifestyle__add-sub-btn" onclick="removeSub(${zi},${i})">Delete</button></td>
            </tr>`).join("")}
          <tr><td colspan="6"><button class="lifestyle__add-sub-btn" onclick="addSub(${zi})">+ Add Sub-Category</button></td></tr>
        </tbody>
      </table>
      <hr style="margin:3rem 0;">
    `;
    container.appendChild(div);
  });
}

window.toggleEdit = (zi) => {
  const zoneDiv = container.children[zi];
  const title = zoneDiv.querySelector(".lifestyle__zone-title");
  const mapZone = zoneDiv.querySelector(".lifestyle__map-zone span");
  const editing = title.contenteditable === "true";
  title.contenteditable = !editing;
  mapZone.contenteditable = !editing;
  if (editing) {
    loadUserData().then(d => {
      d[zi].name = title.textContent.trim();
      d[zi].mapZone = mapZone.textContent.trim();
      save(d);
    });
  }
};

window.updateColor = (zi, v) => loadUserData().then(d => { d[zi].color = v; save(d); render(d); });
window.updateSub = (zi,i,f,v) => loadUserData().then(d => { d[zi].subs[i][f] = v.trim(); save(d); });
window.addSub = (zi) => loadUserData().then(d => { d[zi].subs.push({num:d[zi].subs.length+1,name:"New",goal:"",track:"",result:""}); save(d); render(d); });
window.removeSub = (zi,i) => confirm("Delete forever?") && loadUserData().then(d => { d[zi].subs.splice(i,1); save(d); render(d); });
window.addZone = () => loadUserData().then(d => { d.push({name:"New Zone",color:"#000000",mapZone:"My Map Zone",subs:[]}); save(d); render(d); });

function defaultData() {
  return [
    { name: "Fitness Forest", color: "#C41E3A", mapZone: "Fitness Forest", subs: [
      { num: 1, name: "Cooking/Nutrition", goal: "Eat slow-carb-ish, yummy food without hating life", track: "Meals logged (Y/N) + fasting finish time", result: "Food is delicious fuel, never guilt or hassle" },
      { num: 2, name: "Exercise", goal: "Boxing + daily movement → visible muscle + energy", track: "Boxing sessions + 10-min movement streak", result: "Feel strong, powerful, and proud in my skin" },
      { num: 3, name: "Energy", goal: "Wake happy at 6 am, rate energy 8–10 every day", track: "Daily energy 1–10 + wake-up time", result: "Bound out of bed excited for the day" },
      { num: 4, name: "Rest", goal: "9 hrs sleep, in bed by 10 pm", track: "Bed time + actual hours slept", result: "Fall asleep fast, wake refreshed" }
    ]},
    { name: "Prosperity Palace", color: "#FFD700", mapZone: "Prosperity Palace", subs: [ /* your full data */ ]},
    { name: "Charisma Coast", color: "#FF69B4", mapZone: "Charisma Coast", subs: [ /* ... */ ]},
    { name: "Wisdom Wilds", color: "#00CED1", mapZone: "Wisdom Wilds", subs: [ /* ... */ ]},
    { name: "Sanctuary Stronghold", color: "#7B68EE", mapZone: "Sanctuary Stronghold", subs: [ /* ... */ ]}
  ];
}