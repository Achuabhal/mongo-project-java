var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
var userhelpers=require('../helpers/product-helperuser');
const { render } = require('../app');
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{                     /// this is to inform that user is not logged in so go to login when clicking on cart
    res.redirect('/login')
  }
}



router.get('/', function(req, res, next) {
  let user=req.session.user  
  producthelpers.getAllproducts().then((products)=>{      // ithil dbms ill data dsiplay chyum eniid index illod kodukum  
  console.log(user);
  
  res.render('index', { products ,admin:false,user}); ///we given user name  becuse it is need to change the acount 
})
  });

  router.get('/login', function(req, res, next) {       //ivide user header ill nine login request varum  athh login pagillod link cheyum
   if(req.session.loggedIn){
     res.redirect('/')
   }else{
    res.render('userlogin/login.hbs',{"loginErr":req.session.loginErr});  /// ithil user login eror store cheyth login buttonill eror kanikum
    req.session.loginErr=false
   }
  });


  router.post('/logindata', function(req, res) {
    userhelpers.addProductuser(req.body).then((response)=>{  //ithill response ayiid id verum
      console.log(response);
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user=response.user; //saving the user data in session
        res.redirect('/')
      } else {
        req.session.loginErr=true
        res.redirect('/login')
        
      }
      
    });

    });
  

  router.get('/signup', function(req, res, next) {   //ivide user header ill nine signup request varum  athh signup pagillod link cheyum
    res.render('userlogin/createac.hbs');
  });
  router.post('/createac', function(req, res) {
      userhelpers.createproductuser(req.body).then((response)=>{
        console.log(response);
        res.redirect('/login')
      });

    });

    router.get('/loginagain', function(req, res, next) {
      res.render('userlogin/login.hbs');
    });

    router.get('/logout', function(req, res) {
      console.log('logout')
      req.session.destroy();
      res.redirect('/');
    });
    router.get('/cart',verifyLogin, function(req, res) {
      let userId=req.session.user._id

      userhelpers.getCartProducts(userId).then((products)=>{ 
      
      
      
        res.render('userlogin/cart', {products,user:req.session.user});  //it will display the user name in the cart page
      })
    });
    
      
    router.get('/addcart', function(req, res) {
      let proId=req.query.id      
      let userId=req.session.user._id
      userhelpers.addToCart(proId,userId).then(() => {   //giving the   product id and user id from section 
        userhelpers.getCartProducts(userId).then((products)=>{  //giving the user id from session
          console.log(products);
          
          res.render('userlogin/cart',{products ,user:req.session.user})  //displaying the products in the cart page ;
        })
      })
    });
    
   
    
    



module.exports = router;

