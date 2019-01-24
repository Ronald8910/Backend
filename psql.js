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
var Products = psql.define('products',{
    nama: {type: sequelize.STRING},
    harga: {type: sequelize.INTEGER},
    stok: {type: sequelize.INTEGER},
    berat: {type: sequelize.INTEGER},
    rating: {type: sequelize.INTEGER}
})

Products.sync({force:false}).then()

// get all data
router.get('/produk',(req,res)=>{
    Products.findAll()
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
router.get('produk',(req,res)=>{
    Products.findById(req.params.id)
    .then((x) => {
        res.send(x.dataValues)
    })
    .catch((x) => {
        res.send(x)
    })
})

//post data
router.post('/produk',(req,res)=>{
Products.create({
    nama: req.body.nama,
    harga: req.body.harga,
    stok: req.body.stok,
    berat: req.body.berat,
    rating: req.body.rating 
})
.then((x) => {
    res.send(x)
}).catch((x) => {
            res.send(x)
        })
    })    

//delete

router.delete('produk',(req,res)=>{
    Products.destroy({
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
router.put ('/produk/:id',(req,res)=>{
    Products.update({
        nama: req.body.nama,
        harga: req.body.harga,
        stok: req.body.stok,
        berat: req.body.berat,
        rating: req.body.rating
    },{where: {id: req.params.id}})
    .then(() => {
        res.send({status: 'Data Terupdate'})
    })
    .catch((x) => {
        res.send(x)
    })
})



module.exports = router
