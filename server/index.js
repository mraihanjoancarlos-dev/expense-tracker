const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let txs = [];
let nextId = 1;

app.get('/api/transactions', (req, res) => {
  res.json(txs);
});

app.post('/api/transactions', (req, res) => {
  const tx = { _id: String(nextId++), ...req.body };
  txs.push(tx);
  res.json(tx);
});

app.delete('/api/transactions/:id', (req, res) => {
  txs = txs.filter(t => t._id !== req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));