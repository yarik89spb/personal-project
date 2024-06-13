import mongoose from 'mongoose';

const { Schema } = mongoose;

const viewerResponseSchema = new mongoose.Schema({
  // Define schema fields
  // Example fields:
  name: String,
  age: Number,
}, {collection: 'viewer-responses'
});

const ViewerResponse = mongoose.model('ViewerResponse', viewerResponseSchema);

export default ViewerResponse;
