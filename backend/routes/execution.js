import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import Problem from "../models/Problem.js";
import { User } from "../models/User.js";
import authenticate from "../middleware/authen.js";
import { updateUserStats } from './user.js';
import dotenv from "dotenv";
dotenv.config();


const __dirname = dirname(fileURLToPath(import.meta.url));

const router = express.Router();

//router.use(authenticate);

// Directory setup for storing code files, inputs, and outputs
const dirFiles = path.join(__dirname, "..", "programFiles");
const dirCodes = path.join(__dirname, "..", "programFiles", "codes");
const dirInputs = path.join(__dirname, "..", "programFiles", "inputs");
const dirOutputs = path.join(__dirname, "..", "programFiles", "outputs");

// Ensure directories exist or create them if they don't
fs.mkdirSync(dirFiles, { recursive: true });
fs.mkdirSync(dirCodes, { recursive: true });
fs.mkdirSync(dirInputs, { recursive: true });
fs.mkdirSync(dirOutputs, { recursive: true });

// Function to generate a code file
const generateFile = async (format, content) => {
    const jobID = uuid();
    const fileName = `${jobID}.${format}`;
    const filePath = path.join(dirCodes, fileName);
    fs.writeFileSync(filePath, content);
    return filePath;
};

// Function to generate an input file
const generateInputFile = async (filePath, input, index) => {
    const jobID = path.basename(filePath).split(".")[0];
    const inputPath = path.join(dirInputs, `${jobID}_${index}.txt`);
    fs.writeFileSync(inputPath, input);
    return inputPath;
};

// Function to extract the public class name from a Java file
const extractPublicClassName = (filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const match = fileContent.match(/public\s+class\s+(\w+)/);
    if (match) {
        return match[1];
    } else {
        throw new Error("No public class found in the Java file");
    }
};

// Function to execute code based on language
const executeCode = (filePath, language, inputPath, timeLimit = 5, memoryLimit = "256m") => {
    return new Promise((resolve, reject) => {
        let command;
        
        switch (language) {
            case "cpp":
                command = `docker run --rm --memory=${memoryLimit} --cpus=1 --ulimit cpu=${timeLimit} --volume ${filePath}:/code/code.cpp --volume ${inputPath}:/input.txt cppfile sh -c "g++ /code/code.cpp -o /code/code.out && /code/code.out < /input.txt"`;
                break;
            case "java":
                command = `docker run --rm --memory=${memoryLimit} --cpus=1 --ulimit cpu=${timeLimit} --volume ${filePath}:/code/Main.java --volume ${inputPath}:/input.txt javafile sh -c "javac /code/Main.java && java -cp /code Main < /input.txt"`;
                break;
            case "python":
                command = `docker run --rm --memory=${memoryLimit} --cpus=1 --ulimit cpu=${timeLimit} --volume ${filePath}:/code/code.py --volume ${inputPath}:/code/input.txt pythonfile sh -c "python /code/code.py < /code/input.txt"`;
                break;
            case "javascript":
                command = `docker run --rm --memory=${memoryLimit} --cpus=1 --ulimit cpu=${timeLimit} --volume ${filePath}:/code/code.js --volume ${inputPath}:/code/input.txt nodefile sh -c "node /code/code.js < /code/input.txt"`;
                break;
            default:
                reject(new Error("Unsupported language"));
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Execution Error:", error);
                if (error.code === 1) {
                    reject({ type: "compilation", stderr });
                } else if (error.code === 137) {
                    reject({ type: "TLE", stderr });
                } else if (error.code === 139) {
                    reject({ type: "MLE", stderr });
                } else {
                    reject({ type: "runtime", stderr });
                }
            } else {
                resolve(stdout);
            }
        });
    });
};

// Updated cleanup function to check for directory existence before deleting
const cleanupFiles = () => {
    if (fs.existsSync(dirCodes)) {
        fs.readdir(dirCodes, (err, files) => {
            if (err) {
                console.error('Error reading dirCodes:', err);
                return;
            }
            files.forEach(file => {
                const filePath = path.join(dirCodes, file);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting file ${filePath}:`, unlinkErr);
                    }
                });
            });
        });
    } else {
        console.error('dirCodes directory does not exist');
    }

    if (fs.existsSync(dirInputs)) {
        fs.readdir(dirInputs, (err, files) => {
            if (err) {
                console.error('Error reading dirInputs:', err);
                return;
            }
            files.forEach(file => {
                const filePath = path.join(dirInputs, file);
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting file ${filePath}:`, unlinkErr);
                    }
                });
            });
        });
    } else {
        console.error('dirInputs directory does not exist');
    }
};

// Route to run code
router.post("/run", async (req, res) => {
    const { language, code, input } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }

    const languageMap = {
        cpp: "cpp",
        java: "java",
        python: "py",
        javascript: "js",
    };

    const format = languageMap[language];
    if (!format) {
        return res.status(400).json({ success: false, error: "Unsupported language!" });
    }

    try {
        const filePath = await generateFile(format, code);
        let finalFilePath = filePath;

        if (language === "java") {
            const publicClassName = extractPublicClassName(filePath);
            finalFilePath = path.join(path.dirname(filePath), `${publicClassName}.java`);
            fs.renameSync(filePath, finalFilePath);
        }

        const inputPath = await generateInputFile(filePath, input, 0);

        try {
            const output = await executeCode(finalFilePath, language, inputPath);
            res.status(200).json({ success: true, result: output, message: "Successfully executed" });

            cleanupFiles();
        } catch (error) {
            if (error.type === "compilation") {
                res.status(200).json({ success: false, result: "Compilation Error", message: error.stderr });
            } else if (error.type === "TLE") {
                res.status(200).json({ success: false, result: "Time Limit Exceeded", message: error.stderr });
            } else if (error.type === "MLE") {
                res.status(200).json({ success: false, result: "Memory Limit Exceeded", message: error.stderr });
            } else if (error.type === "runtime") {
                res.status(200).json({ success: false, result: "Runtime Error", message: error.stderr });
            } else {
                res.status(500).json({ success: false, result: "Internal Server Error", message: "Failed to execute code!" });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, result: "Internal Server Error", message: "Failed to execute code!" });
    } finally {
        cleanupFiles();
    }
});


// Route to submit code with test cases
router.post("/submit/:id", authenticate, async (req, res) => {
    const { id } = req.params;  // The problem ID
    const { language, code } = req.body;
    const userId = req.user.id;

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Find the problem by its ID
    const problem = await Problem.findById(id);
    if (!problem) {
        return res.status(404).json({ success: false, error: "Problem not found!" });
    }

    const { hiddenTestCases, difficulty } = problem;
    console.log("TESTCASES:", hiddenTestCases)

    // Map language to file extension
    const languageMap = {
        cpp: "cpp",
        java: "java",
        python: "py",
        javascript: "js",
    };
    const format = languageMap[language];
    if (!format) {
        return res.status(400).json({ success: false, error: "Unsupported language!" });
    }

    try {
        // Generate code file
        const filePath = await generateFile(format, code);
        console.log("FILE GENERATED")
        let finalFilePath = filePath;
        console.log("FILE PATH:", filePath)

        console.log("LANGUAGE:", language)
        if (language === "java") {
            const publicClassName = extractPublicClassName(filePath);
            finalFilePath = path.join(path.dirname(filePath), `${publicClassName}.java`);
            fs.renameSync(filePath, finalFilePath);
        }

        // Run the code against each test case
        for (let i = 0; i < hiddenTestCases.length; i++) {
            const inputPath = await generateInputFile(finalFilePath, hiddenTestCases[i].input, i);
            console.log("INPUT FILE GENERATED")

            try {
                const output = await executeCode(finalFilePath, language, inputPath);
                console.log("OUTPUT:",output)
                console.log("CODE EXECUTED")

                // Compare output with expected output
                console.log("--->",output.trim(),hiddenTestCases[i].output.trim())
                if (output.trim() !== hiddenTestCases[i].output.trim()) {
                    console.log("CHECKING OUTPUT")
                    return res.status(200).json({
                        success: false,
                        result: output,
                        message: `Wrong Answer on test case ${i + 1}`,
                        output:output.trim(),
                        expectedOutput:hiddenTestCases[i].output.trim(),
                    });
                }
            } catch (error) {
                // Handle different error types (compilation, runtime, TLE, MLE)
                if (error.type === "compilation") {
                    return res.status(200).json({ success: false, result: "Compilation Error", message: error.stderr });
                } else if (error.type === "TLE") {
                    return res.status(200).json({ success: false, result: "Time Limit Exceeded", message: error.stderr });
                } else if (error.type === "MLE") {
                    return res.status(200).json({ success: false, result: "Memory Limit Exceeded", message: error.stderr });
                } else if (error.type === "runtime") {
                    return res.status(200).json({ success: false, result: "Runtime Error", message: error.stderr });
                } else {
                    return res.status(500).json({ success: false, result: "Internal Server Error", message: "Failed to execute code!" });
                }
            }
        }

        // If all test cases pass
        await updateUserStats(userId, id);
        
        return res.status(200).json({
            passedAll:true
        });


    } catch (error) {
        return res.status(500).json({ success: false, result: "Internal Server Error", message: "Failed to execute code!" });
    } finally {
        cleanupFiles();
        // console.log("DONE")
    }
});


export default router;



