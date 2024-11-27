const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Використання body-parser для роботи з JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Шлях до кешу
const cacheDir = path.join(__dirname, 'cache');

// Перевіряємо, чи існує кеш, якщо ні — створюємо
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

// Створення нової нотатки (POST /write)
app.post('/write', (req, res) => {
  const { note_name, note } = req.body;

  if (!note_name || !note) {
    return res.status(400).json({ error: 'note_name and note are required' });
  }

  const notePath = path.join(cacheDir, `${note_name}.txt`);
  fs.writeFile(notePath, note, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error writing the note' });
    }
    res.status(201).json({ message: 'Note created successfully' });
  });
});

// Отримання списку всіх нотаток (GET /notes)
app.get('/notes', (req, res) => {
  fs.readdir(cacheDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading notes directory' });
    }
    const notes = files.map(file => file.replace('.txt', ''));
    res.status(200).json({ notes });
  });
});

// Отримання конкретної нотатки (GET /notes/:name)
app.get('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const notePath = path.join(cacheDir, `${noteName}.txt`);

  fs.readFile(notePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.status(500).json({ error: 'Error reading the note' });
    }
    res.status(200).json({ note: data });
  });
});

// Оновлення конкретної нотатки (PUT /notes/:name)
app.put('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const notePath = path.join(cacheDir, `${noteName}.txt`);
  fs.writeFile(notePath, text, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating the note' });
    }
    res.status(200).json({ message: 'Note updated successfully' });
  });
});

// Видалення конкретної нотатки (DELETE /notes/:name)
app.delete('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const notePath = path.join(cacheDir, `${noteName}.txt`);

  fs.unlink(notePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).json({ error: 'Note not found' });
      }
      return res.status(500).json({ error: 'Error deleting the note' });
    }
    res.status(200).json({ message: 'Note deleted successfully' });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
