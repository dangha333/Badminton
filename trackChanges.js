const fs = require('fs');

const currentData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
const oldData = JSON.parse(fs.readFileSync('data-old.json', 'utf-8'));
let history = [];

if (fs.existsSync('history.json')) {
  history = JSON.parse(fs.readFileSync('history.json', 'utf-8'));
}

const now = new Date().toISOString();

// Duyệt từng ngày
currentData.forEach((newEntry) => {
  const oldEntry = oldData.find(e => e.date === newEntry.date);
  if (!oldEntry) return;

  for (const player in newEntry.players) {
    const newVal = newEntry.players[player];
    const oldVal = oldEntry.players[player];

    if (oldVal && newVal !== oldVal) {
      history.push({
        date: newEntry.date,
        timestamp: now,
        player: player,
        oldValue: oldVal,
        newValue: newVal
      });
    }
  }
});

// Ghi lại lịch sử
fs.writeFileSync('history.json', JSON.stringify(history, null, 2), 'utf-8');

// Sao lưu bản hiện tại
fs.copyFileSync('data.json', 'data-old.json');

console.log("✅ Đã ghi nhận thay đổi vào history.json");
