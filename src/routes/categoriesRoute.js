import express from "express";
import { getCategories, postCategory } from "../controllers/categoriesController.js";

const categoriesRoute = express.Router();

categoriesRoute.get('/categories', getCategories);

categoriesRoute.post('/categories', postCategory);

export default categoriesRoute;