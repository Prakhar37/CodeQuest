import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react"; // Added Monaco Editor import
import { getProblemById } from "../services/problemService";
import Swal from "sweetalert2"; // For showing popups

// const API_URL = process.env.REACT_APP_API_URL;

const ProblemDetail = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(""); // Initially empty, will set based on language
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const defaultCodeSnippets = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`,
    python: `print("Hello, World!")`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    javascript: `console.log("Hello, World!");`,
  };

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        // const res = await axios.get("http://localhost:3000/auth/verify");
        const res = await axios.get("http://13.201.94.103:3000/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        //const res = await axios.get(`${API_URL}/auth/verify`);
        if (res.data.status) {
          setIsAuthenticated(true);
          setIsAdmin(res.data.isAdmin); // Assuming your API returns this info
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await getProblemById(id);
        setProblem(response.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
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
      const response = await axios.post(
        // "http://localhost:3000/run",
        "http://13.201.94.103:3000/run",
        //`${API_URL}/run`,
        {
          language,
          code,
          input, // User-provided input from textarea
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        setResult(response.data.result);
        setError("");
      } else {
        setResult("");
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while executing the code.");
      setResult("");
    }
  };

  // Submit code for hidden test cases
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        // `http://localhost:3000/submit/${id}`,
        `http://13.201.94.103:3000/submit/${id}`,
        //`${API_URL}/submit/${id}`,
        {
          language,
          code, // No input is required; this is for hidden test cases
        },
        { withCredentials: true }
      );
      console.log("GOT RESPONSE");
      if (response.data.passedAll) {
        // Show Accepted popup with party popper effect
        Swal.fire({
          title: "Accepted!",
          text: "All test cases passed!",
          icon: "success",
          background: "#fff",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const container = Swal.getHtmlContainer();
            if (container) {
              container.style.background =
                "url(/images/party-popper.gif) no-repeat center";
              container.style.backgroundSize = "cover";
            }
          },
        });
      } else {
        console.log(response);
        // Show Failed popup without party popper effect
        Swal.fire({
          title: "Failed!",
          html: `<p>${response.data.message}</p><p><b>Output: </b>${response.data.output}</p><p><b>Expected Output: </b>${response.data.expectedOutput}</p>`,
          icon: "error",
          background: "#fff",
          confirmButtonText: "Try Again",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while submitting the code.",
        icon: "error",
        confirmButtonText: "Close",
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
            <p>
              <strong>Example {index + 1} Input:</strong> {example.input}
            </p>
            <p>
              <strong>Example {index + 1} Output:</strong> {example.output}
            </p>
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
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: "1" }}>
              <h3>Input</h3>
              <textarea
                className="input-area" // Input area styling
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows="5"
                placeholder="Provide input for your code..."
              />
            </div>
            <div style={{ flex: "1" }}>
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

          {/* Run Button */}
          <button type="submit" className="run-btn">
            Run Code
          </button>
        </form>

        {/* Submit Button */}
        <button onClick={handleSubmit} className="submit-btn">
          Submit Code
        </button>
      </div>
    </div>
  );
};

export default ProblemDetail;
