
import {chromium} from 'playwright';
import { Pool } from 'pg';


const pool = new Pool({
  user: 'aman',
  host: 'localhost',
  database: 'atoz',
  password: 'aman',
  port: 5432
});

const {rows :problems} = await pool.query("SELECT problem_no, practice_link  FROM problems where practice_link like '%geeks%'");

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();


for(let prob of problems){
    await page.goto(prob.practice_link , {waitUntil:'domcontentloaded'})
    const points = await page.locator('span:has-text("Points:") strong').textContent();
    // await pool.query('UPDATE problems SET difficulty = $1 WHERE problem_no = $2', [points, prob.problem_no]);
    console.log(`Updated problem ${prob.problem_no} with difficulty ${points}`);
}
await browser.close();