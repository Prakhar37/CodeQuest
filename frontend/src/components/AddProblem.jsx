// // // src/components/AddProblem.js
// // import React, { useState } from 'react';
// // import { createProblem } from '../services/problemService';


// // const AddProblem = () => {
// //   const [formData, setFormData] = useState({
// //     title: '',
// //     description: '',
// //     inputFormat: '',
// //     outputFormat: '',
// //     constraints: '',
// //     examples: [{ input: '', output: '' }],
// //     difficulty: 'Easy',
// //   });

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   const handleExampleChange = (index, field, value) => {
// //     const newExamples = formData.examples.map((example, idx) =>
// //       index === idx ? { ...example, [field]: value } : example
// //     );
// //     setFormData({ ...formData, examples: newExamples });
// //   };

// //   const handleAddExample = () => {
// //     setFormData({
// //       ...formData,
// //       examples: [...formData.examples, { input: '', output: '' }],
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await createProblem(formData);
// //       alert('Problem created successfully');
// //     } catch (error) {
// //       console.error('Failed to create problem', error);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <h2>Add Problem</h2>
// //       <input
// //         type="text"
// //         name="title"
// //         value={formData.title}
// //         onChange={handleChange}
// //         placeholder="Title"
// //         required
// //       />
// //       <textarea
// //         name="description"
// //         value={formData.description}
// //         onChange={handleChange}
// //         placeholder="Description"
// //         required
// //       ></textarea>
// //       <textarea
// //         name="inputFormat"
// //         value={formData.inputFormat}
// //         onChange={handleChange}
// //         placeholder="Input Format"
// //         required
// //       ></textarea>
// //       <textarea
// //         name="outputFormat"
// //         value={formData.outputFormat}
// //         onChange={handleChange}
// //         placeholder="Output Format"
// //         required
// //       ></textarea>
// //       <textarea
// //         name="constraints"
// //         value={formData.constraints}
// //         onChange={handleChange}
// //         placeholder="Constraints"
// //         required
// //       ></textarea>

// //       <h4>Examples:</h4>
// //       {formData.examples.map((example, index) => (
// //         <div key={index}>
// //           <input
// //             type="text"
// //             value={example.input}
// //             onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
// //             placeholder="Example Input"
// //             required
// //           />
// //           <input
// //             type="text"
// //             value={example.output}
// //             onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
// //             placeholder="Example Output"
// //             required
// //           />
// //         </div>
// //       ))}
// //       <button type="button" onClick={handleAddExample}>
// //         Add Another Example
// //       </button>

// //       <select
// //         name="difficulty"
// //         value={formData.difficulty}
// //         onChange={handleChange}
// //       >
// //         <option value="Easy">Easy</option>
// //         <option value="Medium">Medium</option>
// //         <option value="Hard">Hard</option>
// //       </select>

// //       <button type="submit">Submit</button>
// //     </form>
// //   );
// // };

// // export default AddProblem;



// import React, { useState } from 'react';
// import { createProblem } from '../services/problemService';

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
//         difficulty: 'Easy',
//       });
//     } catch (error) {
//       setError('Failed to create problem. Please try again.');
//       console.error('Failed to create problem', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="add-problem-form">
//       <h2>Add Problem</h2>

//       {/* Title */}
//       <fieldset>
//         <label htmlFor="title">Title</label>
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Problem Title"
//           required
//         />
//       </fieldset>

//       {/* Description */}
//       <fieldset>
//         <label htmlFor="description">Description</label>
//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Problem Description"
//           required
//         ></textarea>
//       </fieldset>

//       {/* Input Format */}
//       <fieldset>
//         <label htmlFor="inputFormat">Input Format</label>
//         <textarea
//           name="inputFormat"
//           value={formData.inputFormat}
//           onChange={handleChange}
//           placeholder="Input Format"
//           required
//         ></textarea>
//       </fieldset>

//       {/* Output Format */}
//       <fieldset>
//         <label htmlFor="outputFormat">Output Format</label>
//         <textarea
//           name="outputFormat"
//           value={formData.outputFormat}
//           onChange={handleChange}
//           placeholder="Output Format"
//           required
//         ></textarea>
//       </fieldset>

//       {/* Constraints */}
//       <fieldset>
//         <label htmlFor="constraints">Constraints</label>
//         <textarea
//           name="constraints"
//           value={formData.constraints}
//           onChange={handleChange}
//           placeholder="Problem Constraints"
//           required
//         ></textarea>
//       </fieldset>

//       {/* Examples */}
//       <fieldset>
//         <h4>Examples</h4>
//         {formData.examples.map((example, index) => (
//           <div key={index} className="example-group">
//             <label>Example {index + 1}</label>
//             <input
//               type="text"
//               value={example.input}
//               onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
//               placeholder="Example Input"
//               required
//             />
//             <input
//               type="text"
//               value={example.output}
//               onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
//               placeholder="Example Output"
//               required
//             />
//           </div>
//         ))}
//         <button type="button" onClick={handleAddExample} className="add-example-btn">
//           Add Another Example
//         </button>
//       </fieldset>

//       {/* Difficulty */}
//       <fieldset>
//         <label htmlFor="difficulty">Difficulty</label>
//         <select
//           name="difficulty"
//           value={formData.difficulty}
//           onChange={handleChange}
//         >
//           <option value="Easy">Easy</option>
//           <option value="Medium">Medium</option>
//           <option value="Hard">Hard</option>
//         </select>
//       </fieldset>

//       {/* Submit */}
//       <button type="submit" className="submit-btn">
//         Submit
//       </button>

//       {error && <p className="error-message">{error}</p>}
//     </form>
//   );
// };

// export default AddProblem;\



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
    difficulty: 'Easy',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = formData.examples.map((example, idx) =>
      index === idx ? { ...example, [field]: value } : example
    );
    setFormData({ ...formData, examples: newExamples });
  };

  const handleAddExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: '', output: '' }],
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


