const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const txSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  type: { type: String, enum: ['income','expense'] },
  category: String,
  date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', txSchema);

app.get('/api/transactions', async (req, res) => {
  const data = await Transaction.find().sort({ date: -1 });
  res.json(data);
});
app.post('/api/transactions', async (req, res) => {
  const tx = new Transaction(req.body);
  await tx.save();
  res.json(tx);
});
app.delete('/api/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));