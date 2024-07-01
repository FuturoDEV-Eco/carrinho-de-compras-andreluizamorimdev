const { Router } = require("express");

const OrderController = require("../controllers/OrderController");

const ordersRoutes = new Router();

ordersRoutes.post("/", OrderController.createOrder.bind(OrderController));

module.exports = ordersRoutes;
