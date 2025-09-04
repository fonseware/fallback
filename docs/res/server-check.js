const statusEl = document.getElementById("status");
const timestampEl = document.getElementById("timestamp");
const incidentListEl = document.getElementById("incident-list");
const mainView = document.getElementById("main-view");
const incidentView = document.getElementById("incident-view");
const incidentContent = document.getElementById("incident-content");

const services = [
  {
    id: "www",
    name: "Main Website",
    url: "https://www.fonseware.com/ping.txt",
  },
  {
    id: "assets",
    name: "Assets",
    url: "https://assets.fonseware.com/ping.txt",
  },
  { id: "forum", name: "Forum", url: "https://forum.fonseware.com/ping.txt" },
  { id: "media", name: "Media", url: "https://media.fonseware.com/ping.txt" },
  {
    id: "storage",
    name: "Storage",
    url: "https://storage.fonseware.com/ping.txt",
  },
  {
    id: "live",
    name: "Live",
    url: "https://live.fonseware.com/hls/ping.txt",
  },
];

const overallStatusEl = document.getElementById("overall-status");
const overallTimestampEl = document.getElementById("overall-timestamp");

async function checkAllServices() {
  let operationalCount = 0;
  let downCount = 0;

  for (const service of services) {
    try {
      const res = await fetch(service.url, { cache: "no-store" });
      const text = await res.text();
      const statusEl = document.getElementById(`status-${service.id}`);

      if (text.trim().toLowerCase() === "pong") {
        statusEl.textContent = "🟢 operational";
        statusEl.style.color = "green";
        operationalCount++;
      } else {
        statusEl.textContent = "🔴 down";
        statusEl.style.color = "red";
        downCount++;
      }
    } catch (err) {
      const statusEl = document.getElementById(`status-${service.id}`);
      statusEl.textContent = "🔴 down";
      statusEl.style.color = "red";
      downCount++;
    }
  }

  const now = new Date().toLocaleTimeString();
  overallTimestampEl.textContent = `last checked at: ${now}`;

  if (downCount === 0) {
    // All services are operational
    overallStatusEl.textContent =
      "🟢 all " + operationalCount + " systems operational";
    overallStatusEl.style.color = "green";
  } else if (downCount === services.length) {
    // All services are down
    overallStatusEl.textContent = "🔴 major outage (cannot connect)";
    overallStatusEl.style.color = "red";
  } else {
    // Some services are down, but not all
    overallStatusEl.textContent =
      "🟠 partial outage. " +
      downCount +
      " of " +
      (downCount + operationalCount) +
      " systems down";
    overallStatusEl.style.color = "orange";
  }
}

// Replace the existing checkStatus function call with:
checkAllServices();
setInterval(checkAllServices, 5000);

async function loadIncidents() {
  try {
    const res = await fetch("events/index.json");
    const files = await res.json();

    if (files.length === 0) {
      incidentListEl.textContent = "there are no past downtime incidents";
      return;
    }

    files.forEach((file) => {
      const btn = document.createElement("button");
      btn.textContent = file.replace(".md", "");
      btn.onclick = () => loadIncident(file);
      incidentListEl.appendChild(btn);
    });
  } catch (err) {
    incidentListEl.textContent = "error loading incident history";
  }
}

async function loadIncident(file) {
  try {
    const res = await fetch(`events/${file}`);
    const md = await res.text();
    const html = marked.parse(md);

    incidentContent.innerHTML = html;
    mainView.style.display = "none";
    incidentView.style.display = "block";
  } catch (err) {
    incidentContent.innerHTML =
      "<p style='color:red;'>failed to load incidents</p>";
  }
}

function goBack() {
  incidentView.style.display = "none";
  mainView.style.display = "block";
}

loadIncidents();
