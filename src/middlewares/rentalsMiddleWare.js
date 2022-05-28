import dayjs from "dayjs";
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

    if(!customerAndGameExist(customers, games)){
      return;
    }

    if(!gameIsAvailable(res, gameId, games)){
      return;
    }

    const {pricePerDay} = games.rows[0];
    res.locals.pricePerDay = parseInt(pricePerDay);

    next();
    
  } catch (e) {
    console.log("Error postRentalsMiddleWare.", e);
    return res.sendStatus(500);
  }
}

export async function postRentalIdMiddleWare(req, res, next){
  try {
    const {id} = req.params;

    const rentals = await connection.query(`
      SELECT * FROM rentals
      WHERE id=$1 AND "returnDate" IS null
    `,[id]);

    if(!rentals.rows[0]){
      return res.sendStatus(400);
    }

    
    const MS_PER_DAY = (1000 * 60 * 60 * 24);
    const msCurrent = Date.parse(new Date());
    const rental = rentals.rows[0];

    const msPrevious = Date.parse(rental.rentDate);    
    const daysInterval = parseInt( (msCurrent - msPrevious) / MS_PER_DAY ) - rental.daysRented;
    const delayDays = daysInterval < 0?0:daysInterval;

    const pricePerDay = rental.originalPrice/rental.daysRented;

    res.locals.delayFee = delayDays * pricePerDay;

    next();
    
  } catch (e) {
    console.log("Error finalizeRentalsMiddleWare.", e);
    return res.sendStatus(500);
  }
}

export async function deleteRentalMiddleWare(req, res, next){
  try {
    const {id} = req.params;

    const rental = await connection.query(`
      SELECT * FROM rentals
      WHERE id=$1
    `, [id]);

    if(!rental.rows[0]) return res.sendStatus(404);
    if(rental.rows[0].returnDate) return res.sendStatus(400);

    next();

  } catch (e) {
    console.log("Error finalizeRentalsMiddleWare.", e);
    return res.sendStatus(500);
  }
}

async function gameIsAvailable(res, gameId, games){
  const qtdRentedGames = await connection.query(`
    SELECT * FROM rentals
    WHERE "returnDate" IS null
    AND "gameId"=$1
  `, [gameId]);

  if(games.rows[0].stockTotal - qtdRentedGames.rowCount < 1){
    res.sendStatus(400);
    return false;
  }
  return true;
}

function customerAndGameExist(customers, games){
  if(!customers.rows[0] || !games.rows[0]){
    res.sendStatus(400);
    return false;
  }
  return true;
}