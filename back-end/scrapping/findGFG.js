import { chromium } from 'playwright';
import { Pool } from 'pg';


const pool = new Pool({
  user: 'aman',
  host: 'localhost',
  database: 'atoz',
  password: 'aman',
  port: 5432
});


const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

async function findGFGLink(query) {
    const searchUrl = "https://www.geeksforgeeks.org/search/";
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('input[type="text"][placeholder="Start Searching..."]');
    let searchBox = await page.locator('input[type="text"][placeholder="Start Searching..."]');


    await searchBox.fill(query);
    await searchBox.press('Enter');

    await page.waitForSelector('a[rel="bookmark"]');


    const firstResult = await page.locator('a[rel="bookmark"]').first().getAttribute('href');
    return firstResult;
}

let problems = await pool.query('SELECT problem_no, problem_name FROM problems where difficulty is null');
for(let problem of problems.rows){
    let link = await findGFGLink(problem.problem_name + ' practice');
    pool.query(
        `UPDATE problems SET practice_link = $1 WHERE problem_no = $2`,
        [link, problem.problem_no]
    );
    console.log(`Updated problem ${problem.problem_name} with link: ${link}`);
}


await browser.close();
