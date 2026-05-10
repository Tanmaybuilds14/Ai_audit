import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  role: {
    type: String
  },
  auditResult: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lead', LeadSchema);
