import Product from "../models/product.js";
import jwt from "jsonwebtoken";



export  function getProducts(req, res) {
  
    Product.find({}).then((product) => {
        
            res.json(product)
        });
    
        
        
}


export function createProducts(req, res) {
    
   if(!isAdmin(req)){
    res.json({
        message: "please login as administrator to add product !!!"
    });
    return;


   }
   const newProductData = req.body;

   const product = new Product(newProductData);
   product.save().then(() => {
    res.json({
        message: "Product created successfully !!!"
    });
   }).catch((error) => {
    res.json({
        message: error
    })
   })


}

/*
export function deleteProduct(req, res) {
    Product.deleteOne({ name: req.params.name }).then(() => {
        res.json({
            message: "Product deleted successfully !!!"
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting Product !!!", error: err.message
        });
    });
}

export function getProductByName(req, res) {
    const name = req.params.name;

    Product.find({ name: name }).then((productList) => {
        res.json({
            list: productList
        });
    }).catch(() => {
        res.json({
            message: "Error retrieving Product !!!"
        });
    });
}
*/


export function isAdmin(req) {
    if(req.user ==null){
        return false;
    }
    if(req.user.type !== "admin"){
        return false;
    }
    return true;
}


export function isCustomer(req) {
    if(req.user ==null){
        return false;
    }
    if(req.user.type !== "customer"){
        return false;
    }
    return true;
}
    
