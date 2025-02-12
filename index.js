const express = require('express');
const fileUpload = require('express-fileupload');
const Tesseract = require('tesseract.js');
const path = require('path');

const app = express();
const port = 4000; // Updated port

app.use(fileUpload());
app.use(express.static(__dirname));

// Serve a simple message at the root URL
app.get('/', (req, res) => {
  res.send('Hello, Salem! Our OCR app is running!');
});

// OCR processing endpoint
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let imageFile = req.files.image;
  const language = req.body.language || 'eng'; // Default to English if not specified

  Tesseract.recognize(imageFile.data, language, {
    logger: (m) => console.log(m),
    langPath: path.join(__dirname, 'tessdata') // Language data path
  })
  .then(({ data: { text } }) => {
    res.send(`<h1>Extracted Text:</h1><pre>${text}</pre>`);
  })
  .catch((err) => {
    console.error('Error processing image:', err);
    res.status(500).send('Error processing image.');
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


