const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 8000;

// Configure multer middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:\\Gpu-SW\\web\\upload'); // Replace with the actual path to the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

app.post('/cuda', upload.single('file'), (req, res) => {
  const { file } = req;

  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  const filePath = file.path;

  // Replace 'path_to_your_c_file' with the actual path to your C file
  const cFilePath = 'D:\\Gpu-SW\\src\\align.cu';
  const runPath = 'D:\\Gpu-SW\\src\\align';

  // Execute the C file with the selected file path as an argument
  exec(`nvcc ${cFilePath} -o ${runPath} && ${runPath} ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      // Handle compilation or execution errors
      res.status(500).json({ error: error.message });
      return;
    }

    // Send the output back to the frontend
    res.json({ output: stdout, error: stderr });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});