import connection from "../database/db.js";
import { postRentalSchema } from "../schemas/rentalsSchema.js";

export async function getRentalMiddleWare(req, res, next){
  const {customerId,gameId} = req.query;

  let query = `SELECT * FROM rentals`;

  if(customerId) {
    query = `
      SELECT * FROM rentals
      WHERE "customerId"=${customerId}
    `;

  } else if(gameId){
    query = `
      SELECT * FROM rentals
      WHERE "gameId"=${gameId}
    `;
  }

  res.locals.query = query;
  next();
}

export async function postRentalMiddleWare(req, res, next){
  try {
    const {customerId, gameId, daysRented} = req.body;

    const validation = postRentalSchema.validate(daysRented);
    if(validation.error){
      return res.status(400).send(validation.detail.message);
    }

    const customers = await connection.query(`
      SELECT * FROM customers
      WHERE id=$1
    `,[customerId]);

    const games = await connection.query(`
      SELECT * FROM games
      WHERE id=$1
    `,[gameId]);

    if(!customers.rows[0] || !games.rows[0])
      return res.sendStatus(400);


    const qtdRentedGames = await connection.query(`
      SELECT * FROM rentals
      WHERE "returnDate" IS null
      AND "gameId"=$1
    `, [gameId]);

    if(games.rows[0].stockTotal - qtdRentedGames.rowCount < 1){
      return res.sendStatus(400);
    }

    const {pricePerDay} = games.rows[0];
    res.locals.pricePerDay = parseInt(pricePerDay);

    next();
    
  } catch (e) {
    console.log("Error postRentalsMeddleWare.", e);
    return res.sendStatus(500);
  }
}