var express = require('express');
var router = express.Router();
const multer = require('multer')
var path = require('path');
// const upload = multer({ dest: 'uploads/' })

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

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    console.log(req.body.izena)
    const protocol = req.protocol
    const host = req.get('host')
    if (req.file) {
        res.send(`Zure izena: ${req.body.izena} Fitxategia: ${protocol}://${host}/uploads/${req.file.filename} `)
    } else {
        res.send("File not uploaded")
    }
})


module.exports = router;
