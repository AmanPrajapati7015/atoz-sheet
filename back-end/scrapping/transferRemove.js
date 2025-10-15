
import {Pool } from 'pg';
import { config } from 'dotenv';

config();

// Local server pool
const localPool =new Pool({
    connectionString : 'postgresql://aman:aman@localhost:5432/atoz'
});

// Remote/Transfer server pool
const transferPool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_MwH9Pisl6ymd@ep-bitter-sun-a1ros77c-pooler.ap-southeast-1.aws.neon.tech/atoz?sslmode=require&channel_binding=require", 
});

const problems = await localPool.query('select * from problems');
console.log(problems.rows);

problems.rows.forEach( async prob =>{
    await transferPool.query('insert into problems (problem_no, problem_name, solution_link, practice_link, difficulty , cat_id) values ($1, $2, $3, $4, $5, $6)', 
        [prob.problem_no, prob.problem_name, prob.solution_link, prob.practice_link, prob.difficulty, prob.cat_id]);


})





