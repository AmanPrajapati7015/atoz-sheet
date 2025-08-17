// scrape.js

import {chromium} from 'playwright';
import { Pool } from 'pg';


const pool = new Pool({
  user: 'aman',
  host: 'localhost',
  database: 'atoz',
  password: 'aman',
  port: 5432
});

(async () => {
  // Launch browser
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Go to target page
    await page.goto('https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/');

    await page.waitForTimeout(3000);

    const rows = page.locator('tr.border-t-2');

    // Loop through each row
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
        let problemName = await rows.nth(i).locator('td:nth-child(2) a').innerText();
        let solutionLink = await rows.nth(i).locator('td:nth-child(4) a')
        let leetcodeLink = await rows.nth(i).locator('td:nth-child(6) a');

        if(await solutionLink.count()>0)
          solutionLink = await solutionLink.getAttribute('href');
        else
          solutionLink = null


        if (await leetcodeLink.count() > 0)
            leetcodeLink = await leetcodeLink.getAttribute('href');
        else
            leetcodeLink = null;
        

        await pool.query(
            `INSERT INTO problems (problem_name, solution_link, practice_link)
            VALUES ($1, $2, $3)`,
            [problemName, solutionLink, leetcodeLink]
        );

    }

    console.log(count);
    await browser.close();
})();
