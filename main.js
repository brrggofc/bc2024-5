const { Command } = require('commander');
const express = require('express');

const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <cache>', 'Cache directory path');

program.parse(process.argv);

const options = program.opts();
const app = express();

app.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}`);
});

app.get('/notes/:name', (req, res) => {
    // Логіка для отримання нотатки
  });

  app.put('/notes/:name', (req, res) => {
    // Логіка для оновлення нотатки
  });

  app.delete('/notes/:name', (req, res) => {
    // Логіка для видалення нотатки
  });

  app.get('/notes', (req, res) => {
    // Логіка для отримання списку нотаток
  });

  app.post('/write', express.urlencoded({ extended: true }), (req, res) => {
    // Логіка для створення нової нотатки
  });

  const path = require('path');
app.get('/UploadForm.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'UploadForm.html'));
});
