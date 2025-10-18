import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

import authRouter from './auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front-end/dist")));


const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DBCONNECTIONSTRING
});



// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  if(!req.headers['authorization']){
    return res.status(403).json({ error: 'no authorization found' });
  }
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'no token found' });
  }
  jwt.verify(token, process.env.JWTSECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
  });

  next();

}

app.use('/auth', authRouter);


app.get('/check', (req, res)=>{
  res.send('running fine');
})

// Route to fetch all problems
app.get('/all', async (req, res) => {
  const { rows: problems } = await pool.query(
    `SELECT *
    FROM problems
    JOIN category ON problems.cat_id = category.cat_id
    ORDER BY problem_no;`
  );
  res.json(problems);
});

app.get('/status', authenticate, async (req, res) => {
  const isDone = Array.from({ length: 455}, () => false);
  
  const email = req.user.email;
  const {rows: problems} = await pool.query('select problem_no from user_problems where email = $1', [email]);
  
  problems.forEach(prob => {
    isDone[prob.problem_no] = true;
  });

  res.json(isDone);
});


app.post('/toggle/:id', authenticate, async (req, res) => {
  const id = +req.params.id;
  const email = req.user.email;
  const { rows: existing } = await pool.query('SELECT * FROM user_problems WHERE email = $1 AND problem_no = $2', [email, id]);
  
  if (existing.length === 0) {
    await pool.query('INSERT INTO user_problems (email, problem_no) VALUES ($1, $2)', [email, id]);
  } else {
    await pool.query('DELETE FROM user_problems WHERE email = $1 AND problem_no = $2', [email, id]);
  }

  res.status(200).send('ok');
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
