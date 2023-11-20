var express = require('express');
var router = express.Router();

let users = [
  {id: Date.now(), izena: "John", abizena: "Doe", email: "john@doe.com"},
];

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
  const bezeroBerria =  {
    izena : req.body.izena,
    abizena: req.body.abizena,
    email: req.body.email
  };

  if (req.body._id) {
      db.bezeroak.update(
          {_id: mongojs.ObjectID(req.body._id)},
          {
              $set: bezeroBerria
          }, function (err) {
              if (err) {
                  console.log(err);
              }
          })
  }else{
      db.bezeroak.insert( bezeroBerria );
  }

  res.redirect('/');
});

router.post("/ezabatu/:id", (req, res) => {
  db.bezeroak.remove(
    {_id:  mongojs.ObjectID(req.body._id)}, function () {
        console.log("zuzen ezabatu da");
    }
  );
  res.redirect('/');
});

router.get("/editatu/:id", (req, res) => {
  db.bezeroak.find(
    {"_id":  mongojs.ObjectID(req.params.id)},
    function (err, doc) {
    if (err) {
        console.log(err)
    } else {
        res.render('editatu', {
            'izenburua': 'Bezeroa editatu',
            'bezeroa': doc[0]
        })
    }
  })
})

module.exports = router;
