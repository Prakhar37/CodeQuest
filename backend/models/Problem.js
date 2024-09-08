import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  examples: [
    {
      input: String,
      output: String,
    },
  ],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
