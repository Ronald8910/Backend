var router = require('express').Router()
var bodyParser = require('body-parser')
router.use(bodyParser.json())

var sequelize = require('sequelize')
var url = 'postgres://postgres:1234@localhost:5432/gudang'
var psql = new sequelize(url)

//connect ko psql
psql.authenticate()
    .then((x) => {
        console.log('Terhubung ke PostgreSQL')
    })

    .catch((x) => {
        console.log('Gagal Terhubung')
    })

//Model def
var Registrasis = psql.define('registrasi',{
    nama: {type: sequelize.STRING},
    umur: {type: sequelize.INTEGER},
    alamat: {type: sequelize.STRING},
    email: {type: sequelize.STRING},
    password: {type: sequelize.INTEGER}
})

Registrasis.sync({force:false}).then()

// get all data
router.get('/registrasi',(req,res)=>{
    Registrasis.findAll()
    .then((x) => {
        var allData = x.map((val, i) => {
            return val.dataValues
        })
        console.log(allData)
        res.send(allData)
    })
    .catch((x) => {
        console.log(x)
        res.send(x)
    })
})
//router by id
router.get('registrasi',(req,res)=>{
    Registrasis.findById(req.params.id)
    .then((x) => {
        res.send(x.dataValues)
    })
    .catch((x) => {
        res.send(x)
    })
})

//post data
router.post('/registrasi',(req,res)=>{
Registrasis.create({
    nama: req.body.nama,
    umur: req.body.umur,
    alamat: req.body.alamat,
    email: req.body.email,
    password: req.body.password 
})
.then((x) => {
    res.send(x)
}).catch((x) => {
            res.send(x)
        })
    })    

//delete

router.delete('registrasi',(req,res)=>{
    Registrasis.destroy({
        where: {id: req.param.id}
    })
    .then(()=>{
        res.send({status:"Data Terhapus"})
    })
    .catch((x)=>{
        res.send(x)
    })
})
// Update by id
router.put ('/registrasi/:id',(req,res)=>{
    Registrasis.update({
        nama: req.body.nama,
        umur: req.body.umur,
        alamat: req.body.alamat,
        email: req.body.email,
        password: req.body.password 
    },{where: {id: req.params.id}})
    .then(() => {
        res.send({status: 'Data Terupdate'})
    })
    .catch((x) => {
        res.send(x)
    })
})



module.exports = router
