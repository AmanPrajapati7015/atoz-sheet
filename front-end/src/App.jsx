import { use, useEffect, useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import axios from 'axios'
import './App.css'

import Category from './Category'
import Navbar from './Navbar';
import Stats from './Stats';

const backendURI = 'http://atoz-sheet-env.eba-4sn9xnkt.ap-south-1.elasticbeanstalk.com'

function App() {
  const [problems, setProblems] = useState({});
  const [isDone, setIsDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  async function fetchProblems() {
    setLoading(true);
    const response = await axios.get(backendURI + '/all');

    try {
      if (user.token) {
        const statusResponse = await axios.get(backendURI + '/status', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setIsDone(statusResponse.data);
      }
      else {
        setIsDone(Array.from({ length: 456 }, () => false));
      }
    }
    catch (error) {
      if (error.response && error.response.statusResponse == 403) {
        alert("Please login to view your problem status.");
        setUser({});
        localStorage.removeItem('user');
      }
    }


    let problemList = [
      //cat_id,
      //cat_name,
      //problems: []
    ];

    for (let i = 0; i < response.data.length; i++) {
      const problem = response.data[i];
      problemList[problem.cat_id] = problemList[problem.cat_id] || { "cat_id": problem.cat_id, "cat_name": problem.cat_name, "problems": [] };
      problemList[problem.cat_id].problems.push(problem);
    }

    for (let id in problemList) {
      problemList[id].problems.sort((a, b) => a.difficulty - b.difficulty);
    }

    setProblems(problemList);
    setLoading(false);
  }

  useEffect(() => {
    (async function () {
      await fetchProblems();
    })()

  }, [user]);

  let totalCount = 0;
  let doneCount = 0;
  for (let id in problems) {
    totalCount += problems[id].problems.length;
    for (let problem of problems[id].problems) {
      if (isDone[problem.problem_no]) {
        doneCount++;
      }
    }
  }


  return (

    <>
      <GoogleOAuthProvider clientId="489174821827-3q7pg44jekajjr4ildqr86l4kcafnl0n.apps.googleusercontent.com">
        <Navbar user={user} setUser={setUser} />
      </GoogleOAuthProvider>

      {loading ? <h1>Loading...</h1> :
        <div className='bg-[#202225] text-white'>

          <div className='hero p-5'>
            <div className='max-w-[1300px] m-auto mb-[50px] flex items-center flex-col gap-4'>
              <h1 className='text-xl font-bold'>Problem List</h1>
              <h2 className='text-2xl font-bold' >
                {doneCount} / {totalCount}
              </h2>
              <div className='status w-full' style={{ height: '15px' }}>
                <div className='green' style={{ flex: doneCount }}></div>
                <div className='remaining' style={{ flex: totalCount - doneCount }}></div>
              </div>
            </div>


            <div className='content max-w-[1300px] m-auto  flex gap-4'  >

              <div className='left  flex-1 '>

                <div className='Problem List'>
                  {problems.map((category, index) => (
                    <Category key={index} category={category} isDone={isDone} setIsDone={setIsDone} user={user} />
                  ))}
                </div>
              </div>

              <div className="right w-[250px]">
                <Stats isDone={isDone} problems={problems} />
              </div>

            </div>
          </div>
        </div>}
    </>
  )
}


export default App