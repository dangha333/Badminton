document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("filter");
  const container = document.querySelector(".card-container");
  const qrPopup = document.getElementById("qrPopup");
  const showQrBtn = document.getElementById("showQrBtn");
  const closeQrBtn = document.getElementById("closeQrBtn");
  const accountPopup = document.getElementById("accountPopup");
  const showAccountBtn = document.getElementById("showAccountBtn");
  const closeAccountBtn = document.getElementById("closeAccountBtn");
  const copyAccountBtn = document.getElementById("copyAccountBtn");
  const copyMsg = document.getElementById("copyMsg");

  // Load data.json và render các card
  try {
    const res = await fetch("data.json");
    const data = await res.json();

    data.forEach(entry => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-date", entry.date);

      let html = `<h3>Ngày ${entry.date}</h3>`;
      for (const [name, amount] of Object.entries(entry.players)) {
        html += `<p><strong>${name}:</strong> ${amount}</p>`;
      }

      card.innerHTML = html;
      container.appendChild(card);
    });

    sortCardsByDate();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }

  // Lọc theo ngày
  select.addEventListener("change", () => {
    const value = select.value;
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
      const date = card.getAttribute("data-date");
      card.style.display = (value === "all" || date === value) ? "block" : "none";
    });
  });

  // Mã QR
  showQrBtn.addEventListener("click", () => {
    qrPopup.style.display = "flex";
  });

  closeQrBtn.addEventListener("click", () => {
    qrPopup.style.display = "none";
  });

  // Tài khoản
  showAccountBtn.addEventListener("click", () => {
    accountPopup.style.display = "flex";
  });

  closeAccountBtn.addEventListener("click", () => {
    accountPopup.style.display = "none";
    copyMsg.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === qrPopup) qrPopup.style.display = "none";
    if (e.target === accountPopup) {
      accountPopup.style.display = "none";
      copyMsg.style.display = "none";
    }
  });

  copyAccountBtn.addEventListener("click", () => {
    const accountNumber = document.getElementById("accountNumber").innerText;
    navigator.clipboard.writeText(accountNumber);
    copyMsg.style.display = "block";
    setTimeout(() => copyMsg.style.display = "none", 1500);
  });
});

function sortCardsByDate() {
  const container = document.querySelector('.card-container');
  const cards = Array.from(container.querySelectorAll('.card'));

  function parseDate(str) {
    const [day, month] = str.split('/').map(Number);
    const year = new Date().getFullYear();
    return new Date(year, month - 1, day);
  }

  cards.sort((a, b) => {
    const dateA = parseDate(a.getAttribute('data-date'));
    const dateB = parseDate(b.getAttribute('data-date'));
    return dateB - dateA;
  });

  cards.forEach(card => container.appendChild(card));
}
