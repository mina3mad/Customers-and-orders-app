import { Router } from 'express';
import { addProduct, totalNumberOfItemsSold, totalRevenue } from './controller/product.controller.js';
const router=Router()
router.post('/',addProduct)
router.get('/totalRevenue',totalRevenue)
router.get('/totalNumSold',totalNumberOfItemsSold)
export default router