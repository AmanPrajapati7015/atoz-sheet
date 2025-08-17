import { useState, useRef, useEffect, use } from 'react'
import axios from 'axios'
import './Category.css';

import videoLink from './assets/video.svg'
import LinkImg from './assets/link.svg'

const backendURI = 'http://atoz-sheet-env.eba-4sn9xnkt.ap-south-1.elasticbeanstalk.com'


function Difficulty({ points }) {
    if (points <= 2)
        return <p className='font-bold text-[#00AC5F]'>Easy</p>;
    else if (points == 4)
        return <p className='font-bold text-[#FFBB00]'>Medium</p>;
    else if (points == 8)
        return <p className='font-bold text-[#EE2F56]'>Hard</p>;
}

function Category({ category, isDone, setIsDone, user }) {

    const [isHidden, setIsHidden] = useState(true);



    function toggleVisibility() {
        setIsHidden(isHidden => !isHidden);
    }

    const totalCount = category.problems.length;
    let doneCount = category.problems.reduce((count, problem) => {
        return count + (isDone[problem.problem_no] ? 1 : 0);
    }, 0);



    function toggleDone(problemNo) {
        return async () => {
            try {
                const response = await axios.post(`${backendURI}/toggle/${problemNo}`, {}, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                setIsDone(isDone => {
                    const newIsDone = [...isDone];
                    newIsDone[problemNo] = !newIsDone[problemNo];
                    return newIsDone;
                })
            }
            catch (error) {
                if (error.response && error.response.status == 403) {
                    alert("Please login to record your progress.");
                }
                console.error("Error toggling problem status:", error);
            }
        }
    }

    return (
        <div>
            <div onClick={toggleVisibility}
                className={
                    'hover:bg-[#13181C] p-4 rounded-lg border border-white flex gap-[10px] items-center cursor-pointer '
                    + `${isHidden ? 'bg-[#2E3136]' : 'bg-[#13181C]'}`
                }>
                <h2 className='flex-6 text-lg font-bold capitalize'>
                    {category.cat_name}
                </h2>

                <span>( {doneCount} / {totalCount} )</span>
                <div className='status flex-4'>
                    <div className='green' style={{ flex: doneCount }}></div>
                    <div className='remaining' style={{ flex: totalCount - doneCount }}></div>

                </div>

            </div>

            <table className={`${isHidden ? 'hidden ' : ''} w-full`}>
                <thead className=''>
                    <tr className='flex flex-1 bg-[#2E3136] border-b-2 py-1 border-[#5E5E5E]'>
                        <th className='flex-1'>Status</th>
                        <th className='flex-4 text-start'>Problem</th>
                        <th className='flex-1'>Difficulty</th>
                        <th className='flex-1'>Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {category.problems.map(problem => (
                        <tr
                            className={'flex flex-1 text-center items-center border-b border-[#5E5E5E]  py-2 ' +
                                `${isDone[problem.problem_no] ? 'bg-[#214B52]' : 'bg-[#2E3136]'}`}

                            key={problem.problem_no}
                        >
                            <td className='flex-1 cursor-pointer text-xl' onClick={toggleDone(problem.problem_no)}>
                                {
                                    isDone[problem.problem_no] ? '✅' : '📋'
                                }
                            </td>
                            <td className='flex-4 flex gap-4 items-center'>
                                <p className='font-bold'>{problem.problem_name} </p>
                                <a href={problem.practice_link} target='_blank'>
                                    <img title='External Link' src={LinkImg} width='15px' alt="" />
                                </a>

                            </td>
                            <td className='flex-1'>
                                <Difficulty points={problem.difficulty} />
                            </td>

                            <td className='flex-1 '>{problem.solution_link ?
                                <a href={problem.solution_link} target="_blank">
                                    <img className='m-auto py-1 px-3 rounded-full hover:bg-[#202225]' src={videoLink} alt="" />
                                </a> :
                                '-'}
                            </td>

                            {/* <td>
                                <a target='_blank' href={problem.practice_link}> {
                                    problem.practice_link.includes('leetcode') ? "leetcode" :
                                        problem.practice_link.includes('geeksforgeeks') ? "gfg" :
                                            "error"
                                }
                                </a>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}


export default Category;