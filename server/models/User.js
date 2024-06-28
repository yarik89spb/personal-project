import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectInfoSchema = new Schema({
  projectId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
})

const UserSchema = new Schema({
  userEmail: {
    type: String,
    unique: true,
    required: true
  },
  userHashedPwd: {
    type: String,
    required: true,
  },
  userName: String, 
  userCompany: String,
  projects: [ProjectInfoSchema]
}, {
  collection: 'users'
});

const User = mongoose.model('User', UserSchema);

export default User;
