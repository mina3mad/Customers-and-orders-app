import dbConnection from "../../../../database/connections.js";
const connection =dbConnection()

//add product
export const addProduct=(req,res,next)=>{
    connection.query(`insert into products set ?`,req.body,(error,result)=>{
        if(error){
            return res.status(500).json({Message:"error"})
        }
        else{
        return res.status(201).json({message:"product added successfully",result})
    }
    })
}

//total revenue
export const totalRevenue=(req,res,next)=>{
    connection.query(`SELECT p.category,sum(OI.quantity*OI.unitPrice)as totalRevenue FROM orderitems AS OI JOIN products as p ON OI.productId=p.id JOIN orders as o ON OI.orderId=o.id GROUP by p.category;`,(error,result)=>{
        if(error){
            return res.status(500).json({Message:"error"})
        }
        else{
        return res.status(200).json({message:"total revenue",result})
    }
    })
}

//total number of items sold for each product.

export const totalNumberOfItemsSold=(req,res,next)=>{
    connection.query(`SELECT p.id,p.productName ,sum(OI.quantity) FROM products as p JOIN orderitems as OI ON p.id =OI.productID GROUP
 BY p.id,p.productName;`,(error,result)=>{
    if(error){
        return res.status(500).json({Message:"error"})
    }
    else{
    return res.status(200).json({message:"total number of items sold for each product",result})
}

 })
}