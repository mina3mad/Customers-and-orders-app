import dbConnection from "../../../../database/connections.js";
const connection=dbConnection()

//create order
export const addOrder=(req,res,next)=>{
    const {customerId,orderItems}=req.body
    let productIds=orderItems.map(item=>item.productId)
    let productidSString=productIds.join(",")
    // console.log(productIds.join(","));
    connection.query(`select unitPrice from products where id in (${productidSString}) order by field(id,${productidSString});`,(error,result)=>{
        if(error){
            return res.status(500).json({Message:"error"})
        }
        else{
        for(let i in orderItems){
            if(!result[i]){
            return res.status(500).json({Message:"error"})

            }
            orderItems[i].unitPrice=result[i].unitPrice
        }
        const currentDate=new Date().toISOString().slice(0,10)
        const totalAmount=orderItems.reduce((acc,curr)=>acc+curr.quantity*curr.unitPrice,0)
        console.log(currentDate,totalAmount,orderItems)
        connection.query(`select *from customers where id=${customerId}`,(error,result)=>{ //query for customer id existence 
            if (error){
                return res.json({Message:error})
            }
            if(result.length){
                connection.query(`INSERT INTO orders VALUES (NULL,'${customerId}','${currentDate}','${totalAmount}');`,(error,result)=>{
                    if (error){
                        return res.json({Message:error})
                    }else{
                        const values=orderItems.map((item)=>`('${result.insertId}' ,'${item.productId}' ,'${item.quantity}','${item.unitPrice}')`)
                        // console.log(values)
                        connection.query(`INSERT INTO orderitems (orderId,productID,quantity,unitPrice) VALUES ${values}`,(error,result)=>{
                            if(error){
                                return res.status(500).json({Message:error})
                            }
                            if (result.affectedRows>1){
                                return res.status(201).json({Message:"order created successfully"})
                            }
                        })
                    }
                })
            }else{
                return res.status(500).json({Message:"cutomer id not exist"})
            }
            
        })
    }
    }) 
}

//API to calculate the average order value.
export const averageOrder=(req,res,next)=>{
    connection.query(`select avg(totalAmount) as order_average_value from orders where customerId=${req.params.id};`,(error,result)=>{
        if (error){
            return res.json({Message:error})

        }
        return res.status(200).json({result})

    })
}


//Write a query to list all customers who have not made any orders.
export const customersHaventMakeOrder=(req,res,next)=>{
    connection.query(`select c.id,c.firstName from customers c left join orders o on c.id=o.customerId where o.id is NULL;`,(error,result)=>{
        if(error){
            return res.json({Message:error})

            
        }
        return res.status(200).json({result})


    })
}


//API to find the customer who has purchased the most items in total.
export const mostItems=(req,res,next)=>{
    connection.query(`SELECT c.id,c.firstName,SUM(OI.quantity) FROM customers c JOIN orders o ON c.id=o.customerID join orderitems OI ON o.id=OI.orderId GROUP BY c.id ORDER BY SUM(OI.quantity) DESC;`,(error,result)=>{
        if(error){
            return res.json({Message:error})

        }
        if(result.length){
            return res.status(200).json({"the customer who purchased the most items is:":result[0]})
        }

    })
}


//API to list the top 10 customers who have spent the most money.
export const top10Customers=(req,res,next)=>{
    connection.query(`SELECT c.id,c.firstName,SUM(o.totalAmount) FROM customers c JOIN orders o ON c.id=o.customerID GROUP BY c.id ORDER BY SUM(o.totalAmount) DESC LIMIT 10;`,(req,res,next)=>{
        if(error){
            return res.json({Message:error})

        }
        if(result.length){
            return res.status(200).json({"the top 10 customers who who have spent the most money is:":result})
        }
        return res.status(404).json({Message:"no results were found!"})
    })
}

//API to list all customers who have made at least 5 orders.
export const customersMadeAtleast5Orders=(req,res,next)=>{
    connection.query(`SELECT c.id,c.firstName,COUNT(o.id) as order_num FROM customers c JOIN orders o ON c.id=o.customerID GROUP BY c.id HAVING COUNT(o.id)>=5 ORDER BY COUNT(o.id) DESC;`,(error,result)=>{
        if(error){
            return res.json({Message:error})

        }
        if(result.length){
            return res.status(200).json({" customers who have made at least 5 orders. is:":result})
        }
        return res.status(404).json({Message:"no results were found!"})

    })

}

//API to find the percentage of customers who have made more than one order.
export const percentage=(req,res,next)=>{
    connection.query(`WITH more_than_one_order AS (
    SELECT o.customerID
    FROM orders o
    GROUP BY o.customerID
    HAVING COUNT(o.id) > 1
)

SELECT 
    COUNT(mto.customerID) * 100.0 / COUNT(c.id) AS percentage
FROM 
    customers c
LEFT JOIN 
    more_than_one_order mto ON c.id = mto.customerID;`,(error,result)=>{
        if(error){
            return res.json({Message:error})

        }
        if(result.length){
            return res.status(200).json({" percentage of customers who have made more than one order:":result})
        }
        return res.status(404).json({Message:"no results were found!"})
    })
}

//API to find the customer who has made the earliest order.
export const earliestOrders=(req,res,next)=>{
    connection.query(`SELECT c.id,c.firstName,c.lastName,o.orderDate FROM customers c JOIN orders o ON c.id=o.customerID ORDER BY o.orderDate ASC LIMIT 1;`,(error,result)=>{
        if(error){
            return res.json({Message:error})

        }
        if(result.length){
            return res.status(200).json({" cthe customer who has made the earliest order is:":result})
        }
        return res.status(404).json({Message:"no results were found!"})

    })
}