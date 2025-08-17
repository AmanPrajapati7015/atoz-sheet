import React from 'react';

function Stats({ isDone, problems }) {
    let easyCount = [0, 0];
    let mediumCount = [0, 0];
    let hardCount = [0, 0];

    problems.forEach(cat => {
        cat.problems.forEach(problem => {
            if (isDone[problem.problem_no]) {
                if (problem.difficulty <= 2) easyCount[0]++;
                else if (problem.difficulty === 4) mediumCount[0]++;
                else if (problem.difficulty === 8) hardCount[0]++;
            }

            if (problem.difficulty <= 2) easyCount[1]++;
            else if (problem.difficulty === 4) mediumCount[1]++;
            else if (problem.difficulty === 8) hardCount[1]++;

        });
    })


    return (
        <div sticky className='bg-[#2E3136] p-3  rounded-xl flex flex-col gap-4 items-center sticky top-[30px] ' >
            <h2 className='text-lg font-bold'>Stats</h2>
            <div className='easy w-full'>
                <div className='flex item-center justify-between mb-1 '>
                    <p className='font-bold text-[#00AC5F]'>Easy</p>
                    <p>{easyCount[0]} / {easyCount[1]}</p>
                </div>
                <div className='status w-full' >
                    <div className='green bg-green-700 ' style={{ flex: easyCount[0] }}></div>
                    <div className='remaining' style={{ flex: easyCount[1] - easyCount[0] }}></div>
                </div>

            </div>

            <div className='medium w-full'>
                <div className='flex item-center justify-between mb-1 '>
                    <p className='font-bold text-[#FFBB00]'>Medium</p>
                    <p>{mediumCount[0]} / {mediumCount[1]}</p>
                </div>
                <div className='status w-full' >
                    <div className='green bg-green-700 ' style={{ flex: mediumCount[0], backgroundColor: '#f8cf5fff' }}></div>
                    <div className='remaining' style={{ flex: mediumCount[1] - mediumCount[0] }}></div>
                </div>

            </div>

            <div className='hard w-full'>
                <div className='flex item-center justify-between mb-1 '>
                    <p className='font-bold text-[#EE2F56]'>Hard</p>
                    <p>{hardCount[0]} / {hardCount[1]}</p>
                </div>
                <div className='status w-full' >
                    <div className='green bg-green-700 ' style={{ flex: hardCount[0], backgroundColor: '#F14667' }}></div>
                    <div className='remaining' style={{ flex: hardCount[1] - hardCount[0] }}></div>
                </div>

            </div>
        </div>
    );

}

export default Stats;