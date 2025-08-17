let categories = [
  "basic maths",
  "basic recursion",
  "basic hashing",
  "sorting techniques",
  "arrays",
  "binary search",
  "strings",
  "linked lists",
  "recursion",
  "bit manipulation",
  "stack and queue",
  "two pointers, sliding window",
  "heaps",
  "greedy algorithms",
  "binary trees",
  "binary search trees",
  "graphs",
  "dynamic programming",
  "trie",
  "stirng algorithms"
]

import { Pool } from 'pg';


const pool = new Pool({
  user: 'aman',
  host: 'localhost',
  database: 'atoz',
  password: 'aman',
  port: 5432
});

for(let cat of categories) {
  await pool.query(
    `INSERT INTO category (cat_name)
     VALUES ($1)`,
    [cat]
  );
}