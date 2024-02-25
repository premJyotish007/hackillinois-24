
// create template for express app

const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const port = 8000;
app.use(cors());
app.use(express.json());

app.get('/parse-code', (req, res) => {
  // run parse.py and return the output from the script
  const { spawn } = require('child_process');
  const file = req.query.file;
  const pyProg = spawn('python3', ['./parse.py', 'code.txt']);
  let result = '';

  pyProg.stdout.on('data', (data) => {
    result += data.toString();
  });

  pyProg.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  pyProg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.send(result);
  });
});

app.get('/unparse-code', (req, res) => {
  // run parse.py and return the output from the script
  const { spawn } = require('child_process');
  const pyProg = spawn('python3', ['./unparse.py', 'input.json']);
  let result = '';

  pyProg.stdout.on('data', (data) => {
    result += data.toString();
  });

  pyProg.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  pyProg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.send(result);
  });
});

// create a route to write a piece of code to a file
app.post('/write-file', (req, res) => {
  const { data } = req.body;
    fs.writeFile('code.txt', data, 'utf8', (err) => {
      if (err) {
        res.status(500).send({ error: 'Error writing file' });
        return;
      }
      res.send({ success: 'File written successfully' });
    });
  });

app.post('/write-json', (req, res) => {
  const to_write = JSON.stringify({ classes: req.body.data.classInfo, functions: req.body.data.functionInfo });
  
  fs.writeFile('input.json', to_write, 'utf8', (err) => {
    if (err) {
      res.status(500).send({ error: 'Error writing file' });
      return;
    }
    res.status(204).send(); // Send a status code of 204 (No Content)
  });
});


app.listen(port, () => {
  console.log(`Server started successfully at http://localhost:${port}`);
});
