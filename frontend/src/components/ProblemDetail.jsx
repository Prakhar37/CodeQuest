// // src/components/ProblemDetail.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getProblemById } from '../services/problemService';

// const ProblemDetail = () => {
//   const { id } = useParams();
//   const [problem, setProblem] = useState(null);

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const response = await getProblemById(id);
//         setProblem(response.data);
//       } catch (error) {
//         console.error('Failed to fetch problem', error);
//       }
//     };

//     fetchProblem();
//   }, [id]);

//   if (!problem) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>{problem.title}</h2>
//       <p>{problem.description}</p>
//       <h4>Input Format:</h4>
//       <p>{problem.inputFormat}</p>
//       <h4>Output Format:</h4>
//       <p>{problem.outputFormat}</p>
//       <h4>Constraints:</h4>
//       <p>{problem.constraints}</p>
//       <h4>Examples:</h4>
//       <ul>
//         {problem.examples.map((example, index) => (
//           <li key={index}>
//             <strong>Input:</strong> {example.input} <br />
//             <strong>Output:</strong> {example.output}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ProblemDetail;



// ProblemDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getProblemById } from '../services/problemService';

// const ProblemDetail = () => {
//   const { id } = useParams();
//   const [problem, setProblem] = useState(null);
//   const [code, setCode] = useState('');
//   const [result, setResult] = useState('');

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const response = await getProblemById(id);
//         setProblem(response.data);
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//       }
//     };

//     fetchProblem();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Implement code submission logic here
//     // Call the backend execution API
//   };

//   if (!problem) return <div>Loading...</div>;

//   return (
//     <div className="problem-detail-container">
//       <div className="problem-description">
//         <h2>{problem.title}</h2>
//         <p>{problem.description}</p>
//         <h3>Input Format</h3>
//         <p>{problem.inputFormat}</p>
//         <h3>Output Format</h3>
//         <p>{problem.outputFormat}</p>
//         <h3>Constraints</h3>
//         <p>{problem.constraints}</p>
//         <h3>Examples</h3>
//         {problem.examples.map((example, index) => (
//           <div key={index}>
//             <p>Example {index + 1} Input: {example.input}</p>
//             <p>Example {index + 1} Output: {example.output}</p>
//           </div>
//         ))}
//       </div>
//       <div className="compiler">
//         <h2>Compiler</h2>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             rows="10"
//             placeholder="Write your code here..."
//             required
//           />
//           <button type="submit">Run Code</button>
//         </form>
//         {result && <div className="result">Result: {result}</div>}
//       </div>
//     </div>
//   );
// };

// export default ProblemDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getProblemById } from '../services/problemService';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp'); // Default language
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await getProblemById(id);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/run', {
        language,
        code,
        input
      });
      if (response.data.success) {
        setResult(response.data.result);
        setError('');
      } else {
        setResult('');
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while executing the code.');
      setResult('');
    }
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="problem-detail-container">
      <div className="problem-description">
        <h2>{problem.title}</h2>
        <p>{problem.description}</p>
        <h3>Input Format</h3>
        <p>{problem.inputFormat}</p>
        <h3>Output Format</h3>
        <p>{problem.outputFormat}</p>
        <h3>Constraints</h3>
        <p>{problem.constraints}</p>
        <h3>Examples</h3>
        {problem.examples.map((example, index) => (
          <div key={index}>
            <p>Example {index + 1} Input: {example.input}</p>
            <p>Example {index + 1} Output: {example.output}</p>
          </div>
        ))}
      </div>
      <div className="compiler">
        <h2>Compiler</h2>
        <form onSubmit={handleSubmit}>
          <select value={language} onChange={handleLanguageChange}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="10"
            placeholder="Write your code here..."
            required
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="5"
            placeholder="Input for the code..."
          />
          <button type="submit">Run Code</button>
        </form>
        {result && <div className="result"><pre>Result: {result}</pre></div>}
        {error && <div className="error"><pre>Error: {error}</pre></div>}
      </div>
    </div>
  );
};

export default ProblemDetail;
