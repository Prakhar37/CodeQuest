// import React, { useState } from 'react';
// import { createProblem } from '../services/problemService';
// import '../App.css';

// const AddProblem = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     inputFormat: '',
//     outputFormat: '',
//     constraints: '',
//     examples: [{ input: '', output: '' }],
//     difficulty: 'Easy',
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleExampleChange = (index, field, value) => {
//     const newExamples = formData.examples.map((example, idx) =>
//       index === idx ? { ...example, [field]: value } : example
//     );
//     setFormData({ ...formData, examples: newExamples });
//   };

//   const handleAddExample = () => {
//     setFormData({
//       ...formData,
//       examples: [...formData.examples, { input: '', output: '' }],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null); // Clear previous error
//     try {
//       await createProblem(formData);
//       alert('Problem created successfully');
//       setFormData({
//         title: '',
//         description: '',
//         inputFormat: '',
//         outputFormat: '',
//         constraints: '',
//         examples: [{ input: '', output: '' }],
//         difficulty: 'easy',
//       });
//     } catch (error) {
//       console.error('Error creating problem:', error.response ? error.response.data : error.message);
//       setError('Failed to create problem. Please try again.');
//     }
//   };

//   return (
//     <div className="add-problem-container">
//       <nav className="navbar">
//         <img src="/images/logo.png" alt="CodeQuest Logo" />
//         <a href="/">
//           <button className="logout-btn">Log Out</button>
//         </a>
//       </nav>
//       <h1 className="add-problem-title">Add Problem</h1>

//       <form className="add-problem-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">Title:</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Enter problem title"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             name="description"
//             rows="4"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Enter problem description"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="input-format">Input Format:</label>
//           <textarea
//             id="inputFormat"
//             name="inputFormat"
//             rows="4"
//             value={formData.inputFormat}
//             onChange={handleChange}
//             placeholder="Enter input format"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="output-format">Output Format:</label>
//           <textarea
//             id="outputFormat"
//             name="outputFormat"
//             rows="4"
//             value={formData.outputFormat}
//             onChange={handleChange}
//             placeholder="Enter output format"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="constraints">Constraints:</label>
//           <textarea
//             id="constraints"
//             name="constraints"
//             rows="4"
//             value={formData.constraints}
//             onChange={handleChange}
//             placeholder="Enter constraints"
//             required
//           />
//         </div>

//         <div className="examples-section">
//           <h3>Examples:</h3>

//           {formData.examples.map((example, index) => (
//             <div key={index}>
//               <div className="form-group">
//                 <label>Example {index + 1} Input:</label>
//                 <input
//                   type="text"
//                   value={example.input}
//                   onChange={(e) =>
//                     handleExampleChange(index, 'input', e.target.value)
//                   }
//                   placeholder="Enter example input"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Example {index + 1} Output:</label>
//                 <input
//                   type="text"
//                   value={example.output}
//                   onChange={(e) =>
//                     handleExampleChange(index, 'output', e.target.value)
//                   }
//                   placeholder="Enter example output"
//                   required
//                 />
//               </div>
//             </div>
//           ))}

//           <button
//             type="button"
//             className="add-example-btn"
//             onClick={handleAddExample}
//           >
//             Add Another Example
//           </button>
//         </div>

//         <div className="form-group">
//           <label htmlFor="difficulty">Difficulty:</label>
//           <select
//             id="difficulty"
//             name="difficulty"
//             value={formData.difficulty}
//             onChange={handleChange}
//             required
//           >
//             <option value="Easy">Easy</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>
//         </div>

//         <button type="submit" className="submit-btn">
//           Submit
//         </button>

//         {error && <p className="error-message">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default AddProblem;


import React, { useState } from 'react';
import { createProblem } from '../services/problemService';
import '../App.css';

const AddProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    examples: [{ input: '', output: '' }],
    hiddenTestCases: [{ input: '', output: '' }],
    difficulty: 'Easy',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handling visible examples
  const handleExampleChange = (index, field, value) => {
    const newExamples = formData.examples.map((example, idx) =>
      index === idx ? { ...example, [field]: value } : example
    );
    setFormData({ ...formData, examples: newExamples });
  };

  // Handling hidden test cases
  const handleHiddenTestCaseChange = (index, field, value) => {
    const newHiddenTestCases = formData.hiddenTestCases.map((testCase, idx) =>
      index === idx ? { ...testCase, [field]: value } : testCase
    );
    setFormData({ ...formData, hiddenTestCases: newHiddenTestCases });
  };

  // Add another example
  const handleAddExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: '', output: '' }],
    });
  };

  // Add another hidden test case
  const handleAddHiddenTestCase = () => {
    setFormData({
      ...formData,
      hiddenTestCases: [...formData.hiddenTestCases, { input: '', output: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      await createProblem(formData);
      alert('Problem created successfully');
      setFormData({
        title: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        examples: [{ input: '', output: '' }],
        hiddenTestCases: [{ input: '', output: '' }],
        difficulty: 'easy',
      });
    } catch (error) {
      console.error('Error creating problem:', error.response ? error.response.data : error.message);
      setError('Failed to create problem. Please try again.');
    }
  };

  return (
    <div className="add-problem-container">
      <nav className="navbar">
        <img src="/images/logo.png" alt="CodeQuest Logo" />
        <a href="/">
          <button className="logout-btn">Log Out</button>
        </a>
      </nav>
      <h1 className="add-problem-title">Add Problem</h1>

      <form className="add-problem-form" onSubmit={handleSubmit}>
        {/* Existing form fields */}
         <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter problem title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter problem description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-format">Input Format:</label>
          <textarea
            id="inputFormat"
            name="inputFormat"
            rows="4"
            value={formData.inputFormat}
            onChange={handleChange}
            placeholder="Enter input format"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="output-format">Output Format:</label>
          <textarea
            id="outputFormat"
            name="outputFormat"
            rows="4"
            value={formData.outputFormat}
            onChange={handleChange}
            placeholder="Enter output format"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="constraints">Constraints:</label>
          <textarea
            id="constraints"
            name="constraints"
            rows="4"
            value={formData.constraints}
            onChange={handleChange}
            placeholder="Enter constraints"
            required
          />
        </div> 

        <div className="examples-section">
          <h3>Examples:</h3>
          {formData.examples.map((example, index) => (
            <div key={index}>
              <div className="form-group">
                <label>Example {index + 1} Input:</label>
                <input
                  type="text"
                  value={example.input}
                  onChange={(e) =>
                    handleExampleChange(index, 'input', e.target.value)
                  }
                  placeholder="Enter example input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Example {index + 1} Output:</label>
                <input
                  type="text"
                  value={example.output}
                  onChange={(e) =>
                    handleExampleChange(index, 'output', e.target.value)
                  }
                  placeholder="Enter example output"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-example-btn"
            onClick={handleAddExample}
          >
            Add Another Example
          </button>
        </div>

        {/* Hidden Test Cases Section */}
        <div className="hidden-testcases-section">
          <h3>Hidden Test Cases (Admin Only):</h3>
          {formData.hiddenTestCases.map((testCase, index) => (
            <div key={index}>
              <div className="form-group">
                <label>Hidden Test Case {index + 1} Input:</label>
                <input
                  type="text"
                  value={testCase.input}
                  onChange={(e) =>
                    handleHiddenTestCaseChange(index, 'input', e.target.value)
                  }
                  placeholder="Enter hidden test case input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Hidden Test Case {index + 1} Output:</label>
                <input
                  type="text"
                  value={testCase.output}
                  onChange={(e) =>
                    handleHiddenTestCaseChange(index, 'output', e.target.value)
                  }
                  placeholder="Enter hidden test case output"
                  required
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-example-btn"
            onClick={handleAddHiddenTestCase}
          >
            Add Another Hidden Test Case
          </button>
        </div>

        {/* Existing Difficulty, Submit button */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddProblem;


