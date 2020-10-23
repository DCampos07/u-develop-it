const sqlite3 = require('sqlite3').verbose(); 

const sqlite3 = require('sqlite3').verbose();
const inputCheck = require('./utils/inputCheck');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//Express Middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

/* Connect to Database */
const db = new sqlite3.Database('./db/election.db', err => {
    if(err){
        return console.error(err.message);
    }

    console.log('Connected to the election database!');
});

/* DB TEST */
 db.all('SELECT * FROM candidates', (err, rows) => {
    console.log(rows);
}); 

/* GET a single candidate */
/* db.get('SELECT * FROM candidates WHERE id = 1', (err, row) => {
    if(err){
        console.log(err);
    }
    console.log(row);
}); */

/* DELETE single record */
/* db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log(result, this, this.changes);
  }); */

/* INSERT new row */
/* const insertSql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
                    VALUES (?,?,?,?)`;
const params= [1,'Ronald','Firbank',1];
//ES5 function so I can use "this" keyword
db.run(insertSql,params, function(err, result){
    if(err){
        console.log(err);
    }
    console.log(result, this.lastID);
}); */

/* GET all candidates */
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql,params, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

/* GET a single candidate */
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
  });
  
  /* DELETE single record */
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'successfully deleted',
            changes: this.change
        });
    });
});  

/* POST */
/* INSERT new row */
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body,'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(400).json({ error: errors });
    }
    const sql = `INSERT INTO candidates(first_name, last_name, industry_connected)
                VALUES(?,?,?)`;
    const params =[body.first_name,body.last_name,body.industry_connected];
    db.run(sql, params, function(err,result){
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            body: body,
            id: this.lastID
        });
    });
});


app.use((req,res)=>{
    res.status(404).end();
});


// Listener
// ===========================================================
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});