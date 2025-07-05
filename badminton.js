// badminton.js

document.addEventListener("DOMContentLoaded", loadData);

const filterSelect = document.getElementById("filter");
const cardContainer = document.getElementById("cardContainer");
const toggleTheme = document.getElementById("toggleTheme");
const qrPopup = document.getElementById("qrPopup");
const accountPopup = document.getElementById("accountPopup");
const copyMsg = document.getElementById("copyMsg");

// Chế độ tối toàn trang


async function loadData() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();

    const summary = {};
    const dates = new Set();

    data.forEach(entry => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-date", entry.date);

      let total = 0;
      let html = `<h3>Ngày ${entry.date} (${getWeekday(entry.date)})</h3>`;
      for (const [name, amount] of Object.entries(entry.players)) {
        html += `<p><strong>${name}:</strong> ${amount}</p>`;
        total += parseFloat(amount);
        summary[name] = (summary[name] || 0) + parseFloat(amount);
      }
    html += `<hr><p class="total"><strong>Tổng:</strong> ${total.toFixed(1)}k</p>`;

      card.innerHTML = html;
      cardContainer.appendChild(card);
      dates.add(entry.date);
    });

    updateFilterOptions(dates);
    sortCardsByDate();
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
}

function getWeekday(dateStr) {
  const [d, m] = dateStr.split("/").map(Number);
  const date = new Date(new Date().getFullYear(), m - 1, d);
  return date.toLocaleDateString('vi-VN', { weekday: 'long' });
}

function updateFilterOptions(dates) {
  [...dates].sort().reverse().forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    filterSelect.appendChild(option);
  });
}

function sortCardsByDate() {
  const cards = Array.from(document.querySelectorAll(".card-container .card"));
  cards.sort((a, b) => {
    const da = a.getAttribute("data-date").split("/").map(Number);
    const db = b.getAttribute("data-date").split("/").map(Number);
    const dateA = new Date(new Date().getFullYear(), da[1]-1, da[0]);
    const dateB = new Date(new Date().getFullYear(), db[1]-1, db[0]);
    return dateB - dateA;
  });
  cards.forEach(card => cardContainer.appendChild(card));
}

function slugify(name) {
  return name.toLowerCase().replace(/ /g, "-");
}

filterSelect.addEventListener("change", () => {
  const value = filterSelect.value;
  document.querySelectorAll(".card").forEach(card => {
    const date = card.getAttribute("data-date");
    card.style.display = (value === "all" || date === value) ? "block" : "none";
  });
});

// QR Popup
const showQrBtn = document.getElementById("showQrBtn");
const closeQrBtn = document.getElementById("closeQrBtn");

showQrBtn.onclick = () => qrPopup.style.display = "flex";
closeQrBtn.onclick = () => qrPopup.style.display = "none";

// Account popup
const showAccountBtn = document.getElementById("showAccountBtn");
const closeAccountBtn = document.getElementById("closeAccountBtn");
const copyAccountBtn = document.getElementById("copyAccountBtn");

showAccountBtn.onclick = () => accountPopup.style.display = "flex";
closeAccountBtn.onclick = () => accountPopup.style.display = "none";

copyAccountBtn.onclick = () => {
  const acc = document.getElementById("accountNumber").innerText;
  navigator.clipboard.writeText(acc);
  copyMsg.style.display = "block";
  setTimeout(() => copyMsg.style.display = "none", 1500);
};

window.onclick = (e) => {
  if (e.target === qrPopup) qrPopup.style.display = "none";
  if (e.target === accountPopup) {
    accountPopup.style.display = "none";
    copyMsg.style.display = "none";
  }
};
