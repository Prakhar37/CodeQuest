import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react'; // Added Monaco Editor import
import { getProblemById } from '../services/problemService';
import Swal from 'sweetalert2'; // For showing popups

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(''); // Initially empty, will set based on language
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const defaultCodeSnippets = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`,
    python: `print("Hello, World!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    javascript: `console.log("Hello, World!");`
  };

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

  useEffect(() => {
    // Set default code based on the language when language changes
    setCode(defaultCodeSnippets[language]);
  }, [language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  // Run code with user input
  const handleRun = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/run', {
        language,
        code,
        input // User-provided input from textarea
      },
      { withCredentials: true, });
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

  // Submit code for hidden test cases
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`http://localhost:3000/submit/${id}`, {
        language,
        code // No input is required; this is for hidden test cases
      },
      { withCredentials: true, });
      if (response.data.passedAll) {
        // Show Accepted popup with party popper effect
        Swal.fire({
          title: 'Accepted!',
          text: 'All test cases passed!',
          icon: 'success',
          background: '#fff',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const container = Swal.getHtmlContainer();
            if (container) {
              container.style.background = 'url(/images/party-popper.gif) no-repeat center';
              container.style.backgroundSize = 'cover';
            }
          }
        });
      } else {
        // Show Failed popup without party popper effect
        Swal.fire({
          title: 'Failed!',
          text: `Your code failed on test case: ${response.data.failedTest}`,
          icon: 'error',
          background: '#fff',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while submitting the code.',
        icon: 'error',
        confirmButtonText: 'Close'
      });
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
            <p><strong>Example {index + 1} Input:</strong> {example.input}</p>
            <p><strong>Example {index + 1} Output:</strong> {example.output}</p>
          </div>
        ))}
      </div>

      <div className="compiler">
        <h2>Compiler</h2>

        {/* Run Form */}
        <form onSubmit={handleRun}>
          <select value={language} onChange={handleLanguageChange}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <MonacoEditor
            height="300px"
            width="100%"
            language={language}
            theme="vs-dark" // Dark theme for Monaco Editor
            value={code}
            onChange={(value) => setCode(value)}
          />

          {/* Input field */}
          <h3>Input</h3>
          <textarea
            className="input-area" // Input area styling
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="5"
            placeholder="Provide input for your code..."
          />

          {/* Run Button */}
          <button type="submit" className="run-btn">Run Code</button>
        </form>

        {/* Submit Button */}
        <button onClick={handleSubmit} className="submit-btn">Submit Code</button>

        {/* Output box for Run */}
        {result && (
          <div className="output-box">
            <h3>Output</h3>
            <div className="result">
              <pre>{result}</pre>
            </div>
          </div>
        )}

        {/* Error message for Run */}
        {error && (
          <div className="output-box">
            <h3>Error</h3>
            <div className="error">
              <pre>{error}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;
