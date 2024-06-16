import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  userName: String,
  questionId: Number,
  text: String
});

const ReactionSchema = new Schema({
  user: String,
  type: String,
  isPositive: Boolean
});

const AnswerSchema = new Schema({
  id: Number,
  text: String,
  isCorrect: Boolean
});

const QuestionSchema = new Schema({
  id: Number,
  title: String,
  comments: [CommentSchema],
  reactions: [ReactionSchema],
  answers: [AnswerSchema] 
}); 

const ProjectResponsesSchema = new Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [QuestionSchema]
}, {
  collection: 'project-responses' // Specify the collection name explicitly
});

const ProjectResponses = mongoose.model('ProjectResponses', ProjectResponsesSchema);

export default ProjectResponses;
