import express from "express";
import connection from "../database/db.js";

const gamesRoute = express.Router();

gamesRoute.get('/games', async (req, res) => {
  let {name} = req.query;
  if(!name) name = '';

  try {
    const games = await connection.query(`
      SELECT games.*, cat.name AS "categoryName"
      FROM games
      JOIN categories cat ON games."categoryId" = cat.id
      WHERE games.name  LIKE $1
    `, [`${name}%`])
    //FIXME: Verificar casesensitive

    res.send(games.rows);

  } catch (e){
    console.log("Error get games.", e);
    return res.sendStatus(500);
  }
});


gamesRoute.post('/games', async (req, res) => {
  const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
  
  try {
    if(!name && stockTotal > 0 && pricePerDay > 0) return res.sendStatus(400);
    const category = await connection.query(`
      SELECT * FROM categories WHERE id=$1
    `, [categoryId]);
    if(!category.rows[0]) return res.sendStatus(400);
    
    const game = await connection.query(`
    SELECT * FROM games WHERE name=$1
    `,[name]);
    
    if(game.rows[0]) return res.sendStatus(409);

    await connection.query(` 
      INSERT INTO games
      (name, image, "stockTotal","categoryId", "pricePerDay")
      VALUES ($1,$2,$3,$4,$5)
    `,[name, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(201);
    
  } catch (e) {
    console.log("Error post games.", e);
    return res.sendStatus(500);
  }
});

export default gamesRoute;