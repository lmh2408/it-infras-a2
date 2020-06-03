const express = require('express');
const bcrypt = require('bcrypt');

var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;

const app = express();
const port = 443;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var pgp = require('pg-promise')();
var db = pgp(process.env.databaseURL);


passport.use(new Strategy(function(username, password, cb) {
        db.any(findUserByUsernameQuery, username).then((users)=>{
            if (result.length == 0) {
                return cb(null, false);
            }
            bcrypt.compare(password, users[0].passwordHash, function(err, result) {
                if (result == false) {
                    return cb(null, false);
                }
                return cb(null, user[0]);
            });

        }).catch((error)=>{
            return cb(error);
        });
    })
);


app.post('/register', (req, res) => {
    var username = res.body.username;
    var password = res.body.password;

    const saltRounds = 10;

    if (!username || !password || username.length > 50 || password.length > 50) {
        res.status(400).end();
        return;
    }

    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            console.log(err);
            res.status(500).end();
            return;
        }

        db.none(addUserQuery, [username, hash])
        .then(()=>{
            res.status(201).end();
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).end();
        });
    });
});



app.post('/add-contact', passport.authenticate('basic', { session: false }), (req, res)=>{
    var contactName = req.body.contactName;
    var phoneNum = req.body.phoneNum;

    if (!contactName || !phoneNum || contactName.length > 50 || phoneNum.length > 50) {
        res.status(400).end();
        return;
    }

    db.none(addContactQuery, [contactName, phoneNum, req.user.userID]).then(()=>{
        res.status(201).end();
    }).catch((err)=>{
        console.log(err);
        res.status(500).end();
    });
});


app.get('/get-contact', passport.authenticate('basic', { session: false }), (req, res) => {
    var contactName = req.query.contactName;
    var limit = Number(req.query.limit);
    var offset = Number(req.query.offset);

    if (!contactName || !limit || !offset || contactName.length > 50) {
        res.status(400).end();
        return;
    }

    db.any(findContactQuery, [req.user.userID, contactName, limit, offset]).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).end();
    });
});

app.delete('/delete-contact', passport.authenticate('basic', { session: false }), (req, res) => {
    var contactName = req.body.contactName;

    if (!contactName || contactName.length > 50) {
        res.status(400).end();
        return;
    }

    db.none(deleteContactQuery, contactName).then(()=>{
        res.status(200).send('Contact entry deleted.');
    }).catch((err)=>{
        console.log(err);
        res.status(500).end()
    });
});


var addUserQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';

var addContactQuery = 'INSERT INTO contacts (contactName, phoneNum, userID) VALUES ($1, $2, $3)';

var findContactQuery = `
    SELECT contactName, contactNumber 
    FROM contacts 
    WHERE userID=$1
    contactName LIKE %$2% 
    LIMIT $3 OFFSET $4 
    ORDERED BY contactName ASC
`;

var deleteContactQuery = 'DELETE FROM contacts WHERE contactName=$1';

var findUserByUsernameQuery = 'SELECT * FROM users WHERE username=$1';



app.listen(port, () => console.log(`Listening at port ${port}`));