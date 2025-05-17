const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3005;
const axios = require('axios');


app.use(express.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'fruitdb' // chose db from http://localhost/phpmyadmin
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database');
});

// Get all fruits
app.get('/fruits', (req, res) => {
  db.query('SELECT * FROM fruits', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add a new fruit
// app.post('/fruits', (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ error: 'Fruit name is required' });

//   db.query('INSERT INTO fruits (name) VALUES (?)', [name], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json({ message: 'Fruit added!', id: result.insertId });
//   });
// });

// Add a new fruit with quantity
app.post('/fruits', (req, res) => {
  const { name, quantity = 1 } = req.body; // default quantity to 1 if not provided
  if (!name) return res.status(400).json({ error: 'Fruit name is required' });


  // Check for duplicates (case insensitive)
  db.query(
    'SELECT * FROM fruits WHERE LOWER(name) = LOWER(?)',
    [name],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) {
        return res.status(400).json({ error: 'Fruit already exists' });
      }

      // No duplicates found, insert new fruit
      db.query(
        'INSERT INTO fruits (name, quantity) VALUES (?, ?)',
        [name, quantity],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          res.json({ message: 'Fruit added!', id: result.insertId });
        }
      );
    }
  );
});


// Delete a fruit by ID
app.delete('/fruits/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM fruits WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Fruit deleted!' });
  });
});

// Update fruit completed status by ID
app.patch('/fruits/:id', (req, res) => {  
  const { id } = req.params;
  const { completed } = req.body;

  // Update the completed status for the fruit with the given ID
  db.query('UPDATE fruits SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Fruit not found' });
    res.json({ message: 'Fruit updated successfully!' });
  });
});

// Receive number selection from dropdown
app.patch('/fruits/:id/quantity', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  db.query('UPDATE fruits SET quantity = ? WHERE id = ?', [quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Fruit not found' });
    res.json({ message: 'Quantity updated' });
  });
});



app.get('/weather', async (req, res) => {
  const { city } = req.query;
  const apiKey = '8CQLqPrDBeRFAALihUSXThGL1B5L6Yt4';

  try {
    const response = await axios.get('https://dataservice.accuweather.com/locations/v1/cities/search', {
      params: {
        apikey: apiKey,
        q: city,
      },
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(response.data[0]); // Return the best match
  } catch (error) {
    console.error('❌ Backend fetch error:', error.message, error.response?.data);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});


