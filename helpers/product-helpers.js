const { get } = require('mongoose');
var db = require('../config/connection')
var collection=require('../config/collections')
const { ObjectId } = require('mongodb');


module.exports = {
  addproduct: (product, callback) => {
    console.log(product);
    db.get().collection('product').insertOne(product).then((data) => {   //ivide product collectionil nin insert cheyyan
      callback(data.insertedId);
    });
  },
  getAllproducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();  //a product motham retrieve cheyyan
      resolve(products);
    });
  },
  deleteProductById:(productId)=>{
    console.log(productId);
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new ObjectId(productId)}).then((response)=>{  //product collectionil nin oranam delete cheyum with the help of id 
        resolve(response)
      })
    })
  },

  getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: new ObjectId(proId)}).then((product)=>{  //on e id detials motham ayyakum array ayyid
        resolve(product)
      })
    })
  },

  updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
      console.log(proDetails);
      db.get().collection(collection.PRODUCT_COLLECTION)
      .updateOne({_id: new ObjectId(proId)},{      //database update akum
        $set:{
          
          productName:proDetails.productName,
          productDescription:proDetails.productDescription,
          productCategory:proDetails.productCategory
        }
      }).then((response)=>{
        resolve(proId)
      })

  })
  }
}
  