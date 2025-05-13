const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Проверка ключа
app.post("/check-key", (req, res) => {
  const inputKey = req.body.key?.trim();

  if (!inputKey) return res.status(400).json({ success: false, message: "Ключ не указан" });

  const filePath = path.join(__dirname, "nasral.json");
  let keys = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (!keys.includes(inputKey)) {
    return res.json({ success: false, message: "Неверный ключ" });
  }

  // Удаляем использованный ключ
  keys = keys.filter(k => k !== inputKey);
  fs.writeFileSync(filePath, JSON.stringify(keys, null, 2));

  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
