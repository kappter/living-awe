let reflections = [];
let currentIndex = 0;

async function loadCSV() {
  const response = await fetch('reflections.csv');
  const text = await response.text();
  reflections = parseCSV(text);
  showReflection(currentIndex);
  renderMindmap();
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : '');
    return obj;
  });
}

function showReflection(index) {
  if (!reflections.length) return;
  const r = reflections[index];
  document.getElementById('topic').textContent = r.Topic;
  document.getElementById('text').textContent = r.Reflection;
  const img = document.getElementById('image');
  if (r.Image) { img.src = r.Image; img.style.display = 'block'; }
  else { img.style.display = 'none'; }
}

document.getElementById('prev').onclick = () => {
  currentIndex = (currentIndex - 1 + reflections.length) % reflections.length;
  showReflection(currentIndex);
};
document.getElementById('next').onclick = () => {
  currentIndex = (currentIndex + 1) % reflections.length;
  showReflection(currentIndex);
};

function renderMindmap() {
  const svgNS = "http://www.w3.org/2000/svg";
  const container = document.getElementById('mindmap');
  container.innerHTML = '';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', 600);
  svg.setAttribute('height', 600);
  container.appendChild(svg);
  const centerX = 300, centerY = 300;
  function drawNode(topic, x, y, level) {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 30);
    circle.setAttribute('fill', '#eee');
    circle.setAttribute('stroke', '#333');
    svg.appendChild(circle);
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = topic.Topic;
    svg.appendChild(text);
    const children = reflections.filter(r => r.ParentTopic === topic.Topic);
    const angleStep = (2 * Math.PI) / children.length;
    children.forEach((child, i) => {
      const angle = i * angleStep;
      const childX = x + Math.cos(angle) * (100 + level * 60);
      const childY = y + Math.sin(angle) * (100 + level * 60);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', y);
      line.setAttribute('x2', childX);
      line.setAttribute('y2', childY);
      line.setAttribute('stroke', '#666');
      svg.appendChild(line);
      drawNode(child, childX, childY, level + 1);
    });
  }
  const roots = reflections.filter(r => !r.ParentTopic);
  roots.forEach((root, i) => {
    const angle = i * ((2 * Math.PI) / roots.length);
    const x = centerX + Math.cos(angle) * 150;
    const y = centerY + Math.sin(angle) * 150;
    drawNode(root, x, y, 1);
  });
}

loadCSV();