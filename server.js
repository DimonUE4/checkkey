const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // <--- добавлено

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS только с твоего сайта
app.use(cors({
  origin: 'https://whateverittakesteam.ru'
}));

app.use(express.json());

// Отдача статики (если будет нужно)
app.use(express.static("public"));

// Проверка ключа
app.post("/check-key", async (req, res) => {
  const inputKey = req.body.key?.trim();

  if (!inputKey) {
    return res.status(400).json({ success: false, message: "Ключ не указан" });
  }

  const filePath = path.join(__dirname, "nasral.json");

  let keys;
  try {
    keys = JSON.parse(await fs.promises.readFile(filePath, "utf-8"));
    console.log("Текущие ключи:", keys); // Логируем текущие ключи
  } catch (err) {
    return res.status(500).json({ success: false, message: "Ошибка чтения базы ключей" });
  }

  if (!keys.includes(inputKey)) {
    return res.json({ success: false, message: "Неверный ключ" });
  }

  // Удаляем использованный ключ
  const updatedKeys = keys.filter(k => k !== inputKey);
  console.log("Обновлённые ключи:", updatedKeys); // Логируем обновлённые ключи

  try {
    await fs.promises.writeFile(filePath, JSON.stringify(updatedKeys, null, 2));
    console.log("Запись в файл завершена."); // Логируем, что запись прошла успешно
  } catch (err) {
    return res.status(500).json({ success: false, message: "Ошибка записи базы ключей" });
  }

  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
