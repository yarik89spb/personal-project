import mongoose from 'mongoose';

const { Schema } = mongoose;

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
  projects: [String]
}, {
  collection: 'users'
});

const User = mongoose.model('User', UserSchema);

export default User;
