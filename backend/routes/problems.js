import express from 'express';
import Problem from '../models/Problem.js'; // Adjust the path if necessary
import authenticate from '../middleware/authen.js';

const router = express.Router();

// Create a new problem
router.post('/create', async (req, res) => {
  try {
    // Extracting the hiddenTestCases from the request body
    const { title, description, inputFormat, outputFormat, constraints, examples, hiddenTestCases, difficulty } = req.body;

    // Creating a new problem object including hidden test cases
    const problem = new Problem({
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      examples,
      hiddenTestCases,  // <-- Added hiddenTestCases to the problem creation
      difficulty,
    });

    // Saving the new problem to the database
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get all problems
router.get('/all', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a problem by ID
router.get('/:id',async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a problem by ID
router.put('/:id',async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a problem by ID
router.delete('/:id', async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
