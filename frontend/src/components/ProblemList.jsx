// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const ProblemList = () => {
//   const [problems, setProblems] = useState([]);

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/problems/all');
//         setProblems(response.data);
//       } catch (error) {
//         console.error('Error fetching problems:', error);
//       }
//     };

//     fetchProblems();
//   }, []); // Empty dependency array means this effect runs once on mount

//   return (
//     <div>
//       {/* <h1>Problem List</h1> */}
//       <ul>
//         {problems.map(problem => (
//           <li key={problem._id}>
//             <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProblemList;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/problems/all');
        setProblems(response.data);
        
        // Fetch user's solved problems from your API
        const solvedResponse = await axios.get('http://localhost:3000/auth/solved');
        console.log(solvedResponse.data)
        setSolvedProblems(solvedResponse.data.map(e=>e._id)); // Assuming the response contains a list of solved problem IDs
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const isProblemSolved = (problemId) => {
    return solvedProblems.includes(problemId);
  };

  return (
    <div className="problem-list-container">
      {/* <h1>Problem List</h1> */}
      <ul className="problem-list">
        {problems.map((problem) => (
          <li
            key={problem._id}
            className={`problem-item ${isProblemSolved(problem._id) ? 'solved' : ''}`}
          >
            <Link
              to={`/problems/${problem._id}`}
              className="problem-link"
            >
              {problem.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;


