import mongoose from 'mongoose';

const { Schema } = mongoose;

const OptionSchema = new Schema({
  id: Number,
  text: String,
  isCorrect: Boolean,
});

const QuestionSchema = new Schema({
  id: Number,
  title: String,
  content: String,
  options: [OptionSchema], 
});

const UserProjectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [QuestionSchema],
}, {
  collection: 'user-projects' // Specify the collection name explicitly
});

const UserProject = mongoose.model('UserProject', UserProjectSchema);

export default UserProject;
