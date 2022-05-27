import express from "express";
import dotenv from "dotenv";
import connection from "../database/db.js";

dotenv.config();

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals', async (req, res) => {
  try {
    const rentals = await connection.query(`
      SELECT * FROM rentals
    `);

    

    const result = [];
    //console.log(rentals.rows, customer.rows, game.rows);
    for(const rental of rentals.rows){

      const {customerId, gameId} = rental;

      const customer = await connection.query(`
        SELECT id, name FROM customers
        WHERE id=$1
      `,[customerId]);

      const game = await connection.query(`
        SELECT gm.id, gm.name, gm."categoryId", cat.name AS "categoryName" 
        FROM games gm
        JOIN categories cat ON gm."categoryId" = cat.id
        WHERE gm.id=$1
      `,[gameId]);

      result.push({...rental, customer: customer.rows[0], game: game.rows[0]})
    }
    console.log('result',result)
   
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