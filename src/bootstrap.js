import customerRouter from './modules/customers/customer.route.js'
import productRouter from './modules/products/product.route.js'
import orderRouter from './modules/orders/order.route.js'
const bootstrap=(app,express)=>{
    app.use(express.json())
    app.use('/customers',customerRouter)
    app.use('/products',productRouter)
    app.use('/orders',orderRouter)
    app.use('*',(req,res,next)=>{
        res.json({message:"url not found"})
    })
}
export default bootstrap