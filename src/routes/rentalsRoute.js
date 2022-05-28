import express from "express";
import dotenv, { parse } from "dotenv";
import connection from "../database/db.js";
import dayjs from "dayjs";

dotenv.config();

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals', async (req, res) => {
  let {customerId,gameId} = req.query;
  console.log('Data: ', customerId, gameId);

  let query = customerId
  ?`SELECT * FROM rentals
      WHERE "customerId"=${customerId}`
  :`SELECT * FROM rentals`;

  if(!customerId){
    query = gameId
      ?`SELECT * FROM rentals
        WHERE "gameId"=${gameId}`
      :`SELECT * FROM rentals`;

  }
  
  try {
    const rentals = await connection.query(query);  

    const result = [];
    for(const rental of rentals.rows){
      console.log('RETAL',rental)
      const {customerId: customer_id, gameId:game_id} = rental;

      const customer = await connection.query(`
        SELECT id, name FROM customers
        WHERE id=$1
      `,[customer_id]);

      const game = await connection.query(`
        SELECT gm.id, gm.name, gm."categoryId", cat.name AS "categoryName" 
        FROM games gm
        JOIN categories cat ON gm."categoryId" = cat.id
        WHERE gm.id=$1
      `,[game_id]);
      
      console.log('game: ', game.rows)
      result.push({...rental, customer: customer.rows[0], game: game.rows[0]})  
    }
    
    console.log(result)
    res.send(result); 

  } catch(e){
    console.log("Error get rentals.", e);
    return res.sendStatus(500);
  }
});

rentalsRoute.post('/rentals',async (req, res) => {
  const {customerId, gameId, daysRented} = req.body;
  try {
    const jogo = await connection.query(`
      SELECT * FROM games
      WHERE id=$1
    `, [gameId]);

    console.log('dados',customerId, gameId, Number(daysRented), dayjs().format('DD/MM/YY'), jogo.rows[0].pricePerDay * daysRented)

    await connection.query(`
      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
      VALUES ($1,$2,$3,$4,$5)
    `, [
      parseInt(customerId),
      parseInt(gameId),
      parseInt(daysRented),
      dayjs().format('DD/MM/YY'),
      parseInt(daysRented * jogo.rows[0].pricePerDay)
    ]);

    res.sendStatus(201);
  } catch (e) {
    console.log("Error post rentals.", e);
    return res.sendStatus(500);
  }

});

rentalsRoute.post('/rentals/:id/return',(req, res) => {

});

rentalsRoute.delete('/rentals/:id', (req, res) => {
  
})

export default rentalsRoute;