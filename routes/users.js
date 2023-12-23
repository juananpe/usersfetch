var express = require('express');
var router = express.Router();

// let users = [
//   {id: Date.now(), izena: "John", abizena: "Doe", email: "john@doe.com"},
// ];

const mongojs = require('mongojs')
const db = mongojs('bezeroakdb', ['bezeroak'])

const multer = require('multer')
var path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1]
      cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const filter = function fileFilter(req, file, cb) {
  // console.log(file.mimetype.split('/')[1])
  if (file.mimetype.split('/')[1] !== 'jpg' && file.mimetype.split('/')[1] !== 'png') {
      cb(null, false)
  } else {
      cb(null, true)
  }
}
const limits = {
  fileSize: 2000000
}

const upload = multer({ storage: storage, fileFilter: filter, limits: limits })

router.post('/igo', upload.single('avatar'), function (req, res, next) {
  const protocol = req.protocol
  const host = req.get('host')
  if (req.file) {
      res.send(`Zure izena: ${req.body.izena} Fitxategia: ${protocol}://${host}/uploads/${req.file.filename} `)
  } else {
      res.send("File not uploaded")
  }
})

let users = []

db.bezeroak.find( function (err, userdocs) {
  if (err) {
      console.log(err)
  } else {
      users = userdocs
  }
})


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render("users", {
    title: "Erabiltzaileak",
    users: users,
  });
})


router.get('/list', function (req, res, next) {
  res.json(users)
});


router.post("/new", upload.single('avatar'), (req, res) => {
  // console.log(req.file); va bien
  let user = {
    izena: req.body.izena,
    abizena: req.body.abizena,
    id: req.body.id,
    email: req.body.email,
    argazkia: req.file.filename
  }
  // console.log(user); va bien
  users.push(user);

  db.bezeroak.insert(user, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      console.log(user)
      res.json(user)
    }
  });
  // res.redirect('/');
});

router.delete("/delete/:id", (req, res) => {
  users = users.filter((user) => user.id != req.params.id);
  db.bezeroak.remove(
    { id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err)
      } else {
        console.log(user)
      }
    }
  );
  res.json(users);
});

router.put("/update/:id", (req, res) => {
  let user = users.find(user => user.id == req.params.id);
  user.izena = req.body.izena;
  user.abizena = req.body.abizena;
  user.email = req.body.email;

  db.bezeroak.update(
    { id: req.params.id },
    { $set: { izena: req.body.izena, abizena: req.body.abizena, email: req.body.email } },
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
