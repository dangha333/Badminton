const chokidar = require("chokidar");
const { exec } = require("child_process");

const watcher = chokidar.watch("data.json", {
  persistent: true,
  ignoreInitial: true,
});

watcher.on("change", (path) => {
  console.log(`🌀 Đã phát hiện thay đổi ở ${path}`);
  exec("node trackChanges.js", (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Lỗi khi chạy trackChanges.js:", err);
    } else {
      console.log(stdout);
    }
  });
});
