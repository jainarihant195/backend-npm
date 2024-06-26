const express = require('express')
const dotenv = require("dotenv").config();
const cors=require('cors');
const mysql = require('mysql');
// const connection = mysql.createConnection(process.env.URI);
const db = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.DATABASE_USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.PORT,
}
);
const app = express()
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // enable set cookie
}));


const port = 3000

app.use(express.json())
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
  });

// Route to fetch all favorite packages
app.get('/favorites', (req, res) => {
    db.query('SELECT * FROM favorite_packages', (err, results) => {
      if (err) {
        console.error('Error fetching favorite packages:', err);
        res.status(500).send('Error fetching favorite packages');
        return;
      }
      console.log(results);
      res.json(results);
    });
  });
  
  // Route to add a new favorite package
  app.post('/favorites', (req, res) => {
    const { package_name, reason } = req.body;
    db.query('INSERT INTO favorite_packages (package_name, reason) VALUES (?, ?)', [package_name, reason], (err, results) => {
      if (err) {
        console.error('Error adding favorite package:', err);
        res.status(500).send('Error adding favorite package');
        return;
      }
      res.status(201).send('Favorite package added');
    });
  });
  
  // Route to delete a favorite package
  app.delete('/favorites/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM favorite_packages WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error deleting favorite package:', err);
        res.status(500).send('Error deleting favorite package');
        return;
      }
      res.send('Favorite package deleted');
    });
  });
  
  // Route to update the reason for a favorite package
  app.put('/favorites/:id', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    db.query('UPDATE favorite_packages SET reason = ? WHERE id = ?', [reason, id], (err, results) => {
      if (err) {
        console.error('Error updating favorite package:', err);
        res.status(500).send('Error updating favorite package');
        return;
      }
      res.send('Favorite package updated');
    });
  });


app.listen(port, () => {
  console.log(`Backend is listening at http://localhost:${port}`)
})

