import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, enum: ['shared', 'personal', 'utilities', 'groceries', 'other'], default: 'other' }, // For AI tagging
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  household: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  involved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users sharing this
  receiptUrl: { type: String }, // S3/Cloudinary URL for OCR
  aiData: {
    type: Object,
    default: {},
    // e.g. { ocr: {...}, classification: "shared", fairnessScore: 0.8 }
  },
  settled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Expense', expenseSchema);