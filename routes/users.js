var express = require('express');
var router = express.Router();

// let users = [
//   {id: Date.now(), izena: "John", abizena: "Doe", email: "john@doe.com"},
// ];

const mongojs = require('mongojs')
const db = mongojs('bezeroakdb', ['bezeroak'])

db.bezeroak.find( function (err, userdocs) {
  if (err) {
      console.log(err)
  } else {
      console.log(userdocs)
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.bezeroak.find( function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                'izenburua': 'EJS probatzen',
                'bezeroak': docs
            })
        }
    });
});

router.get('/list', function(req, res, next) {
  res.json(users)
  });


router.post("/new", (req, res) => {
  users.push(req.body);

  db.bezeroak.insert(req.body, function (err, user) {
    if (err) {
        console.log(err)
    } else {
        console.log(user)
        res.json(user)
    }
  });
  // res.redirect('/');
});

router.delete("/ezabatu/:id", (req, res) => {
  users = users.filter((user) => user.id != req.params.id);
  db.bezeroak.remove(
    {_id:  mongojs.ObjectID(req.params.id)}, function (err, user) {
        if (err) {
            console.log(err)
        } else {
            console.log(user)            
        } 
    }
  );
  // res.redirect('/');
});

router.get("/editatu/:id", (req, res) => {
  let user = users.find((user) => user.id == req.params.id);
  user.user = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;

  db.bezeroak.update(
    {_id:  mongojs.ObjectID(req.params.id)}, 
    {$set: {izena: req.body.izena, abizena: req.body.abizena, email: req.body.email}}, 
    function (err, user) {
      if (err) {
          console.log(err)
      } else {
          console.log(user)            
      } 
    }
  );
  res.json(user);
})

module.exports = router;
