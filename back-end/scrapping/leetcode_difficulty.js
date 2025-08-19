

// import {chromium} from 'playwright';
// import { Pool } from 'pg';


// const pool = new Pool({
//   user: 'aman',
//   host: 'localhost',
//   database: 'atoz',
//   password: 'aman',
//   port: 5432
// });

// const {rows :problems} = await pool.query("SELECT problem_no,practice_link  FROM problems where practice_link like '%leetcode%'");

// const browser = await chromium.launch({ headless: false });
// const page = await browser.newPage();

// const toNum = {'Easy': 2, 'Medium': 4, 'Hard': 8};

// // for(let prob of problems){
// //     await page.goto(prob.practice_link , {waitUntil:'domcontentloaded'})
// //     let difficulty = await page.locator('[class*="text-difficulty-"]')
// //     if(await difficulty.count() > 0){
// //         difficulty = await page.locator('[class*="text-difficulty-"]').textContent();
// //         difficulty = toNum[difficulty];
// //         await pool.query('UPDATE problems SET difficulty = $1 WHERE problem_no = $2', [difficulty, prob.problem_no]);
        
// //         console.log(`Problem No: ${prob.problem_no}, Difficulty: ${difficulty}`);
// //     }
// //     // console.log(`Updated problem ${prob.problem_no} with difficulty ${points}`);
// // }

// await browser.close();

import axios from "axios";
const res = await axios.get('https://api.atoz.linkpc.net/all')

console.log(res.data);
