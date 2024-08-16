import { Router } from "express";
import { addOrder, averageOrder, customersHaventMakeOrder, customersMadeAtleast5Orders, earliestOrders, mostItems, percentage, top10Customers } from "./controller/order.controller.js";
const router=Router()
router.post('/addOrder',addOrder)
router.get('/averageOrder/:id',averageOrder)
router.get('/customerWithoutOrders',customersHaventMakeOrder)
router.get('/mostItems',mostItems)
router.get('/top10',top10Customers)
router.get('/atLeast5Orders',customersMadeAtleast5Orders)
router.get('/percentage',percentage)
router.get('/earliestOrder',earliestOrders)
export default router