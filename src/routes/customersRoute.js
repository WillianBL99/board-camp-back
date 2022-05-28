import express from "express";
import { getCustomer, getCustomers, postCustomer, putCustomer } from "../controllers/customersController.js";
import { getCustomerMiddleWare, getCustomersMiddleWare, postCostumerMiddleWare, putCustomerMiddleWare } from "../middlewares/customersMiddleWare.js";

const customersRoute = express.Router();

customersRoute.get('/customers', getCustomersMiddleWare, getCustomers);

customersRoute.get('/customers/:id', getCustomerMiddleWare, getCustomer);

customersRoute.post('/customers', postCostumerMiddleWare, postCustomer);

customersRoute.put('/customers/:id', putCustomerMiddleWare, putCustomer);

export default customersRoute;