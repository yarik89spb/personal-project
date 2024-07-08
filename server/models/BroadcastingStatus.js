import mongoose from 'mongoose';

const { Schema } = mongoose;

const BroadcastingStatusSchema = new Schema({
  isBroadcasting: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
}, {
  collection: 'broadcasting-status'
})

const BroadcastingStatus = mongoose.model('BroadcastingStatus', BroadcastingStatusSchema);

export default BroadcastingStatus;
