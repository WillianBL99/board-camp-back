import express from "express";
import connection from "../database/db.js";

const categoriesRoute = express.Router();

categoriesRoute.get('/categories', async (req, res) => {
  try {
    const categories = await connection.query(`
      SELECT * FROM categories
    `);

    res.send(categories.rows);
    
  } catch (e) {
    console.log("Error get categories.", e);
    return res.sendStatus(500);
  }
});

categoriesRoute.post('/categories', async (req, res) => {
  const {name} = req.body;
  
  try{
    if(!name) return res.sendStatus(400);

    const category = await connection.query(`
      SELECT * FROM categories WHERE name = $1
    `, [name]);
    if(category.rows[0]) return res.sendStatus(409);

    await connection.query(` 
      INSERT INTO categories (name)
      VALUES ($1)
    `, [name]);

    res.sendStatus(201);

  } catch (e){
    console.log("Error post categories.", e);
    return res.sendStatus(500);
  }

});

export default categoriesRoute;