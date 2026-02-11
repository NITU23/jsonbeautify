window.onload = updateLineNumbers;

let matches = [], current = 0;

/* editor basics */
function updateLineNumbers() {

  const textarea = document.getElementById("jsonInput");
  const lineNumbers = document.getElementById("lineNumbers");

  const lines = textarea.value.split("\n").length;

  let nums = "";
  for (let i = 1; i <= lines; i++) {
    nums += i + "\n";
  }

  lineNumbers.innerText = nums;

  /* keep same height as textarea */
  lineNumbers.style.height = textarea.clientHeight + "px";
}

function syncScroll() {
  lineNumbers.scrollTop = jsonInput.scrollTop;
  highlightLayer.scrollTop = jsonInput.scrollTop;
}

/* JSON operations */
function validateJSON() {

  const alertBox = document.getElementById("alertBox");

  try {
    JSON.parse(jsonInput.value);

    alertBox.className = "alertBox alert-success";
    alertBox.innerText = "JSON is valid ✔";
    alertBox.style.display = "block";

  } catch (e) {

    alertBox.className = "alertBox alert-error";
    alertBox.innerText = "Invalid JSON ❌ : " + e.message;
    alertBox.style.display = "block";
  }
}


function showModal(text) {
  modalText.innerText = text;
  popupModal.style.display = "flex";
}

function closeModal() {
  popupModal.style.display = "none";
}


function prettifyJSON() {
  jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value), null, 4);
  updateLineNumbers();
}
function minifyJSON() {
  jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value));
  updateLineNumbers();
}
function copyJSON() {
  jsonInput.select(); document.execCommand("copy");
}
function downloadJSON() {
  const blob = new Blob([jsonInput.value], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.json";
  a.click();
}

/* file */
function loadFile() { fileInput.click(); }
function readFile(e) {
  const reader = new FileReader();
  reader.onload = x => {
    jsonInput.value = x.target.result;
    updateLineNumbers();
  };
  reader.readAsText(e.target.files[0]);
}

/* search */
function liveSearch() {
  const key = searchInput.value;
  matches = [];
  if (!key) { highlightLayer.innerHTML = jsonInput.value; return; }

  const text = jsonInput.value;
  let pos = text.indexOf(key);
  while (pos != -1) { matches.push(pos); pos = text.indexOf(key, pos + key.length); }
  matchCount.innerText = matches.length + " matches";

  highlightLayer.innerHTML =
    text.replace(new RegExp(key, "gi"),
      m => `<span class="highlight">${m}</span>`);
}
function nextMatch() { if (matches.length) selectMatch((current + 1) % matches.length); }
function prevMatch() { if (matches.length) selectMatch((current - 1 + matches.length) % matches.length); }
function selectMatch(i) {
  current = i;
  jsonInput.focus();
  jsonInput.setSelectionRange(matches[i], matches[i] + searchInput.value.length);
}
function searchKey(e) { if (e.key === "Enter") nextMatch(); }

/* tree + folding */
function generateTree() {
  treeContainer.innerHTML = "";
  treeContainer.appendChild(buildTree(JSON.parse(jsonInput.value)));
}

function buildTree(obj) {
  const div = document.createElement("div");
  if (typeof obj === "object" && obj !== null) {
    const toggle = document.createElement("span");
    toggle.textContent = "▶ ";
    const child = document.createElement("div");
    toggle.onclick = () => child.style.display =
      child.style.display === "none" ? "block" : "none";
    div.append(toggle, child);
    for (let k in obj) {
      const node = document.createElement("div");
      node.className = "node";
      node.textContent = k + ": ";
      node.appendChild(buildTree(obj[k]));
      child.appendChild(node);
    }
  } else div.textContent = obj;
  return div;
}

function clearText() { jsonInput.value = ""; updateLineNumbers(); }

function toggleTheme() {
  document.body.classList.toggle("dark");
}

