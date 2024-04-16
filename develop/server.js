const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '0706',
    database: 'movie_db'
  },
  console.log(`Connected to the movie_db database.`)
);

// RENDER MOVIE LIST
app.get('/api/movies', (req, res) =>
db.query("SELECT id, movie_name AS title FROM movies",  (err, data) => {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
      });
  })
);

// RENDER REVIEW LIST
app.get('/api/reviews', (req, res) =>
db.query("SELECT id, review AS title FROM reviews",  (err, data) => {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
      });
  })
);


// ADD A MOVIE
app.post('/api/add-movie', ({ body },res) => {

    const sql = `INSERT INTO movies (movie_name) VALUES (?)`;
    const params = [body.movie_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
  console.log(body,'body')

});

// UPDATE A MOVIE REVIEW
app.put('/api/review/:id', (req,res) => {

    const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
    const params = [req.body.review, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    
    } else if (!result.affectedRows) {
        res.json({
        message: "Movie not found",
        });
    } else {
        res.json({
        message: "success",
        data: req.body,
        changes: result.affectedRows,
        });
    }
});
});

app.delete('/api/movie/:id', (req,res) => {

    const sql = `DELETE FROM movies WHERE id = ?`;
    const deletedRow = [req.params.id];

    db.query(sql, deletedRow, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
          
          } else if (!result.affectedRows) {
              res.json({
              message: "Movie not found",
              });
          } else {
              res.json({
              message: "success delete",
              changes: result.affectedRows,
              id: req.params.id,
              });
          }
      });


});

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});