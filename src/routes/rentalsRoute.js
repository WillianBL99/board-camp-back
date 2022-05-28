import express from "express";
import dotenv from "dotenv";
import connection from "../database/db.js";

dotenv.config();

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals', async (req, res) => {
  let {customerId,gameId} = req.query;

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

      const {customer_id, game_id} = rental;

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

      result.push({...rental, customer: customer.rows[0], game: game.rows[0]})
    }
   
   res.send(result); 

  } catch(e){
    console.log("Error get customers.", e);
    return res.sendStatus(500);
  }
});

rentalsRoute.post('/rentals/:id',(req, res) => {

});

rentalsRoute.post('/rentals/:id/return',(req, res) => {

});

rentalsRoute.delete('/rentals/:id', (req, res) => {
  
})

export default rentalsRoute;