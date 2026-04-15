const totalBlocks = 20;

let linkedPositions = [];
let indexedPositions = [];

function createBlock(content, filled = false) {
  const div = document.createElement("div");
  div.className = "block" + (filled ? " filled" : "");
  div.innerText = content;
  return div;
}

function getFileSize() {
  return parseInt(document.getElementById("fileSize").value) || 5;
}

function generatePositions(size) {
  let arr = [];
  while (arr.length < size) {
    let r = Math.floor(Math.random() * totalBlocks);
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}

// 🔵 CONTIGUOUS
function renderContiguous(size) {
  const container = document.getElementById("contiguous");
  container.innerHTML = "";

  let start = Math.floor(Math.random() * (totalBlocks - size));

  for (let i = 0; i < totalBlocks; i++) {
    let isFile = i >= start && i < start + size;
    container.appendChild(createBlock(isFile ? i : i, isFile));
  }
}

// 🔗 LINKED (with real chain)
function renderLinked(size) {
  const container = document.getElementById("linked");
  container.innerHTML = "";

  let order = linkedPositions.slice(0, size);

  for (let i = 0; i < totalBlocks; i++) {
    let index = order.indexOf(i);
    let isFile = index !== -1;

    let block = createBlock(i, isFile);

    if (isFile && index !== size - 1) {
      block.innerText = `${i}→${order[index + 1]}`;
    }

    container.appendChild(block);
  }
}

// 📇 INDEXED
function renderIndexed(size) {
  const container = document.getElementById("indexed");
  container.innerHTML = "";

  let order = indexedPositions.slice(0, size);

  // Index block
  let indexBlock = createBlock("Index", true);
  indexBlock.classList.add("indexBlock");
  container.appendChild(indexBlock);

  for (let i = 0; i < totalBlocks; i++) {
    let isFile = order.includes(i);
    container.appendChild(createBlock(i, isFile));
  }

  // Mapping
  let mapping = document.createElement("div");
  mapping.innerText = "Index → " + order.join(", ");
  mapping.style.marginTop = "10px";
  container.appendChild(mapping);
}

// 🔄 RENDER ALL
function renderAll() {
  let size = getFileSize();

  linkedPositions = generatePositions(size);
  indexedPositions = generatePositions(size);

  renderContiguous(size);
  renderLinked(size);
  renderIndexed(size);
}

// 🎬 ANIMATION
async function animateAllocation() {
  let size = getFileSize();

  linkedPositions = generatePositions(size);
  indexedPositions = generatePositions(size);

  for (let i = 1; i <= size; i++) {
    renderContiguous(i);
    renderLinked(i);
    renderIndexed(i);

    let blocks = document.querySelectorAll(".filled");
    blocks.forEach(b => b.style.transform = "scale(1.2)");

    await new Promise(res => setTimeout(res, 500));

    blocks.forEach(b => b.style.transform = "scale(1)");
  }
}

// 📖 EXPLANATION
function showExplanation() {
  const box = document.getElementById("explainBox");

  box.style.display = "block";

  box.innerHTML = `
    <h3>📘 File Allocation Methods</h3>

    <b>Contiguous:</b> Stores file in continuous blocks.<br>
    ✔ Fast access<br>
    ✖ Fragmentation problem<br><br>

    <b>Linked:</b> Blocks are scattered and connected.<br>
    ✔ No fragmentation<br>
    ✖ Slow traversal<br><br>

    <b>Indexed:</b> Uses index block for addresses.<br>
    ✔ Direct access<br>
    ✖ Extra memory<br>
  `;
}
