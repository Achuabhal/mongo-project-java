const { get } = require('mongoose');
var db = require('../config/connection')
const collection = require('../config/collections');
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb');


module.exports={
    
    addProductuser: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            
            try {
                let user=await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email});
                console.log(user)
                let password;

                
                if (user) {                           //ithil engrpth data compare cheyyunnu
                    bcrypt.compare(userData.password, user.Password ).then((status) => { 
                        console.log(user.Password)  //ith comaapre chayth staus illod true or false idum 
                       
                        if (status) {
                            console.log('login success');
                            response.user = user;
                            response.status = true;
                            resolve(response);
                        } else {
                            console.log('login failed');
                            resolve({ status: false });
                        }
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    console.log('user not found');
                    resolve({ status: false });
                }
            } catch (error) {
                reject(error);
            }
        })
    },
    
    


    


    createproductuser: (userData)=>{   //ithill atyam vannapasswor dine bycrpt enna library kond  vere rithillod matum athh kazhi aaht mongo lodd idum  pinne athinte id athh kodukum respomse ayyid
        return new Promise(async(resolve)=>{
        userData.Password=await bcrypt.hash (userData.password, 10)
        console.log(userData);
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {   
            resolve(data.insertedId)
    
        })
        })
        },

        addToCart:(proId,userId)=>{
            return new Promise(async(resolve,reject)=>{
                let cartItems=await db.get().collection(collection.CART_COLLECTION).findOne({user: new ObjectId (userId)})
                if(cartItems){
                    db.get().collection(collection.CART_COLLECTION).updateOne({user: new ObjectId(userId)},
                    {
                        $push:{products:new ObjectId(proId)}
                    }
                    ).then((response)=>{
                        resolve()
                    })

                }
                else{
                    let cartObj={
                        user: new ObjectId(userId),
                        products:[ new ObjectId(proId)]
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                        resolve()
                    })
                }


        

                resolve(cartItems)
            })
        },


        getCartProducts: (userId) => {
            return new Promise(async (resolve) => {
                let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match: { user: new ObjectId(userId) }
                    },
                    {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION,  // product collection
                            let: { proList: '$products' },  /// prroducts in cart  The '$' in '$products' refers to the field named "products" in the user's cart document. It's MongoDB syntax to access a field's value within an aggregation pipeline.


                            pipeline: [
                                {
                                    $match: {
                                        $expr: {                      

                                            $in: ['$_id', '$$proList']            /// in and expression is used there ithil product id and product list id compare cheyyunnu                                                         
                                        }                         /// id product collection ill ollathan 
                                    }
                                }
                            ],
                            as:'cartItems'
                        }
                    }
                ]).toArray();
                resolve(cartItems[0].cartItems);          // cartItems: [
                                                         //{ id: 1, name: 'Product 1', quantity: 2 },
                                                        // { id: 2, name: 'Product 2', quantity: 1 }
            });
        }
    }

