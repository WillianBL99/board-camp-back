import express from "express";
import { getCategories, postCategory } from "../controllers/categoriesController.js";
import { postCategoriesMiddleWare } from "../middlewares/categoriesMiddleWare.js";

const categoriesRoute = express.Router();

categoriesRoute.get('/categories', getCategories);

categoriesRoute.post('/categories', postCategoriesMiddleWare, postCategory);

export default categoriesRoute;