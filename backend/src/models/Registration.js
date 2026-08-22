import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true
  },
  answers: {
    type: mongoose.Schema.Types.Mixed, // Use Mixed to store any object
    required: [true, 'Answers are required']
  },
  luckyNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 100,
    max: 999
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
registrationSchema.index({ luckyNumber: 1 }, { unique: true });
registrationSchema.index({ createdAt: -1 });

// Transform for JSON responses
registrationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;