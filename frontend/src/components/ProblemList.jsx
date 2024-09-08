// // src/components/ProblemList.js
// import React, { useEffect, useState } from 'react';
// import { getProblems } from '../services/problemService';

// const ProblemList = () => {
//   const [problems, setProblems] = useState([]);

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const response = await getProblems();
//         setProblems(response.data);
//       } catch (error) {
//         console.error('Failed to fetch problems', error);
//       }
//     };

//     fetchProblems();
//   }, []);

//   return (
//     <div>
//       {/* <h2>Problem List</h2> */}
//       <ul>
//         {problems.map((problem) => (
//           <li key={problem._id}>
//             <h3>{problem.title}</h3>
//             <p>{problem.description}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProblemList;


// import React from 'react';

// const ProblemList = ({ problems }) => { // Accept problems as a prop

//   return (
//     <div>
//       {/* <h2>Problem List</h2> */}
//       <ul>
//         {problems.length > 0 ? ( // Check if problems array is not empty
//           problems.map((problem) => (
//             <li key={problem._id}>
//               <h3>{problem.title}</h3>
//               <p>{problem.description}</p>
//             </li>
//           ))
//         ) : (
//           <p>No problems available at the moment.</p> // Fallback message when no problems exist
//         )}
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

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/problems/all');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div>
      {/* <h1>Problem List</h1> */}
      <ul>
        {problems.map(problem => (
          <li key={problem._id}>
            <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;
