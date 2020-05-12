const firebase = require('firebase-admin')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

var serviceAccount = require("./firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://database-file-administrasi.firebaseio.com"
});

var app = express()

app.set('view engine', 'ejs')

app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser('fauzi'))

app.get('/daftar', function(req, res, next){
    return res.render('signup')
})

app.get('/masuk', function(req, res, next){
    return res.render('signin')
})

app.get('/validate-token/:token', function(req, res, next){
    var token = req.params.token
    firebase.auth().verifyIdToken(token).then(function(decodedToken) {
        res.cookie('auth', token)
        res.redirect("/beranda")
    }).catch(function(error) {
        res.send("gagal")
    });
})

app.use(function (req, res, next){
    var token = req.cookies.auth
    console.log(token)
    if(!token){
        return res.redirect('/masuk')
    }

    firebase.auth().verifyIdToken(token).then(function(decodedToken) {
        req.user = decodedToken
        next()
    }).catch(function(error) {
        res.redirect('/masuk')
    });
})

app.get('/beranda', function(req, res, next){
    res.render('homepage')
})

app.get('/dokumen', function(req, res, next){
    res.render('dokumen')
})

app.get('/pengaturan', function(req, res, next){
    res.render('pengaturan')
})

app.get('/pengumuman', function(req, res, next){
    res.render('pengumuman')
})

app.get('/keluar', function(req, res, next){
    res.clearCookie('auth')
    res.redirect('/masuk')
})

app.listen(5000, function(){
    console.log('app.started')
})