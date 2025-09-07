let reflections = [];
let currentIndex = 0;

// Load CSV
fetch("reflections.csv")
  .then(response => response.text())
  .then(data => {
    reflections = parseCSV(data);
    showReflection(0);
    drawMindmap();
  });

function parseCSV(data) {
  const lines = data.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

function showReflection(index) {
  if (!reflections.length) return;
  const r = reflections[index];
  const div = document.getElementById("reflection");
  div.innerHTML = `
    <h3>${r.title || "Untitled"}</h3>
    <p><em>${r.topic}</em> • ${r.date || ""}</p>
    <p>${r.snippet}</p>
    ${r.image ? `<img src="images/${r.image}" alt="">` : ""}
    ${r.link ? `<p><a href="${r.link}" target="_blank">More</a></p>` : ""}
  `;
  currentIndex = index;
}

document.getElementById("prev").addEventListener("click", () => {
  const newIndex = (currentIndex - 1 + reflections.length) % reflections.length;
  showReflection(newIndex);
});

document.getElementById("next").addEventListener("click", () => {
  const newIndex = (currentIndex + 1) % reflections.length;
  showReflection(newIndex);
});

// Mindmap (basic with Awe at center)
function drawMindmap() {
  const svg = document.getElementById("mindmapCanvas");
  const centerX = 400, centerY = 300;
  const radius = 200;

  // Draw center node
  const aweCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
  aweCircle.setAttribute("cx", centerX);
  aweCircle.setAttribute("cy", centerY);
  aweCircle.setAttribute("r", 40);
  aweCircle.setAttribute("fill", "#4a90e2");
  svg.appendChild(aweCircle);

  const aweText = document.createElementNS("http://www.w3.org/2000/svg","text");
  aweText.setAttribute("x", centerX);
  aweText.setAttribute("y", centerY + 5);
  aweText.setAttribute("text-anchor", "middle");
  aweText.setAttribute("fill", "white");
  aweText.textContent = "Awe";
  svg.appendChild(aweText);

  // Draw topic nodes around circle
  const topics = [...new Set(reflections.map(r => r.topic))];
  topics.forEach((topic, i) => {
    const angle = (i / topics.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const node = document.createElementNS("http://www.w3.org/2000/svg","circle");
    node.setAttribute("cx", x);
    node.setAttribute("cy", y);
    node.setAttribute("r", 25);
    node.setAttribute("fill", "#f39c12");
    svg.appendChild(node);

    const label = document.createElementNS("http://www.w3.org/2000/svg","text");
    label.setAttribute("x", x);
    label.setAttribute("y", y + 5);
    label.setAttribute("text-anchor", "middle");
    label.textContent = topic;
    svg.appendChild(label);

    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", centerX);
    line.setAttribute("y1", centerY);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "#999");
    svg.insertBefore(line, node); // so lines sit behind nodes
  });
}

