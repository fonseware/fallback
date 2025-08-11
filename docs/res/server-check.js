    const statusEl = document.getElementById("status");
    const timestampEl = document.getElementById("timestamp");
    const incidentListEl = document.getElementById("incident-list");
    const mainView = document.getElementById("main-view");
    const incidentView = document.getElementById("incident-view");
    const incidentContent = document.getElementById("incident-content");

    async function checkStatus() {
    try {
    const res = await fetch("https://www.fonseware.com/ping.txt", {
    cache: "no-store",
});
    const text = await res.text();
    const now = new Date().toLocaleTimeString();

    if (text.trim().toLowerCase() === "pong") {
    statusEl.textContent = "🟢 all systems operational";
    statusEl.style.color = "green";
} else {
    statusEl.textContent =
    "🟠 partial outage (unexpected response)";
    statusEl.style.color = "orange";
}

    timestampEl.textContent = `last checked at: ${now}`;
} catch (err) {
    const now = new Date().toLocaleTimeString();
    statusEl.textContent = "🔴 major outage (cannot connect)";
    statusEl.style.color = "red";
    timestampEl.textContent = `last checked at: ${now}`;
}
}

    checkStatus();
    setInterval(checkStatus, 5000);

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