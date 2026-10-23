import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { connectDatabase } from './db.js';

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).send('<h1>Both username and password are required.</h1>');
  }

  try {
    const pool = await connectDatabase();
    await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );

    res.send(`
      <h1>Login details saved successfully</h1>
      <p>Username: ${escapeHtml(username)}</p>
      <p>Password stored for this demo.</p>
    `);
  } catch (error) {
    console.error('Unable to save login details:', error);
    res.status(500).send(`<h1>Unable to save login details.</h1><p>${escapeHtml(error.message)}</p>`);
  }
});

async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('MySQL connection failed during startup:', error.message);
  }

  app.listen(port, () => {
    console.log(`Login app listening on port ${port}`);
  });
}

startServer();