
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

    const buttons = page.locator('button.flex.items-center.justify-between.w-full.group');
    let count = await buttons.count();
    for (let i = 0; i < count; i++) {
        await buttons.nth(i).click();
        // page.waitForTimeout(1000);
    }


    const rows = page.locator('tr.border-t-2');

    // Loop through each row
    count = await rows.count();
    console.log('====================================');
    console.log(count);
    console.log('====================================');
    for (let i = 0; i < count; i++) {
        let problemName = await rows.nth(i).locator('td:nth-child(2) a').innerText();
        console.log(problemName);

        
        let ytLink = await rows.nth(i).locator('td:nth-child(5) div.cursor-pointer');

        
        if(await ytLink.count() >0){
            console.log('found ytIcon');
            
            await rows.nth(i).locator('td:nth-child(5) div.cursor-pointer').click();

            let link = await page.locator('a.btn-brand-2[href*="youtu.be"], a.btn-brand-2[href*="youtube.com"]');
            console.log('located youtube button open in new tab');

            ytLink = await link.getAttribute('href');
        
            console.log(ytLink);
            
            await page.locator('button.rounded-lg.text-white:has-text("Close")').first().click();
            console.log("closed");


        }
        else {
            ytLink = null;
        }


        await pool.query(
            'UPDATE problems SET solution_link = $1 WHERE problem_name = $2',
            [ytLink, problemName]
        ).catch(err => {
            console.error('Error updating video link:', err);
        }
        )

    }


    await browser.close();
})();
