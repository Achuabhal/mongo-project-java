var express = require('express');
var producthelpers=require('../helpers/product-helpers');   ///product helper kettum
const { log } = require('handlebars');
var router = express.Router();

router.get('/', function(req, res) {
  producthelpers.getAllproducts().then((products)=>{     /// ithillayirun padd product array vazhi store cheythe
    console.log(products);
    res.render('admin/adminproduct', { products ,admin:true});  

  })
  
  
  });


  
    router.get('/add-product', function(req, res, next) {
      res.render('admin/add-product', {admin:true});  //ividunan  true koduthillel user anvbar displa  cheyum
  
    });
    router.post('/add-product', function(req, res, next) {
      console.log(req.body);                                           ///ivide ann data formil nin varunne
      console.log(req.files.Image);
      
      producthelpers.addproduct(req.body,(id)=>{
        let image=req.files.fileeUpload
        console.log(id);
        image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{    /// ivide ann data mongo lood paraj vidunne
          if(!err){
            res.render('admin/add-product')          //mongo ill nin vanna id image rename cheyth stre cheyum
          }else{
            console.log(err);
          }
        })
      })
  });
  router.get('/delete-product/', function(req, res, next) {
    let proId=req.query.id
    console.log(proId);
    producthelpers.deleteProductById(proId).then(() => {
      res.redirect('/admin');
    });
     
  });
  router.get('/edit-product',function(req,res){
    let proId=req.query.id
    producthelpers.getProductDetails(proId).then((product)=>{
      console.log(product);
      res.render('admin/edit-product',{product,admin:true})   ///evide edit cheyanda data formikllod ayyakum (dbm)
    })
  });
 router.post('/edit-product',function(req,res){
  let proId=req.query.id
  console.log(proId);
  console.log(req.body);
  producthelpers.updateProduct(proId,req.body).then(()=>{
    res.redirect('/admin')                      //ith edit cheyaanda data id and new data eduth update cheutnnu product helper vazhi
    if(req.files.fileUpload){
      console.log(req.files.fileUpload);
      let id=req.query.id
      let image=req.files.fileUpload
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
  
 })

module.exports = router;
