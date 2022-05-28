import connection from "../database/db.js";
import dayjs from "dayjs";

export async function getRentals(req, res){    
  try {
    const rentals = await connection.query(res.locals.query);
    const result = [];

    for(const rental of rentals.rows){
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
      
      result.push({...rental, customer: customer.rows[0], game: game.rows[0]})  
    }
    
    res.send(result); 

  } catch(e){
    console.log("Error get rentals.", e);
    return res.sendStatus(500);
  }
}

export async function postRental(req, res){
  try {
    const {customerId, gameId, daysRented} = req.body;
    const {pricePerDay} = res.locals;
    
    await connection.query(`
      INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
      VALUES ($1,$2,$3,$4,$5)
    `, [
      parseInt(customerId),
      parseInt(gameId),
      parseInt(daysRented),
      dayjs().format('DD/MM/YY'),
      parseInt(daysRented * pricePerDay)
    ]);

    res.sendStatus(201);

  } catch (e) {
    console.log("Error post rentals.", e);
    return res.sendStatus(500);
  }
}

export async function postRentalId(req, res){
  const {id} = req.params;
  try {
    await connection.query(`
      UPDATE rentals 
      SET  
        "returnDate"=$1,
        "delayFee"=$2
      WHERE id=$3        
    `,[
        dayjs().format('DD-MM-YY'),
        res.locals.delayFee,
        id
      ]
    );
    
    res.sendStatus(200);
  } catch (e) {
    console.log("Error post rentals.", e);
    return res.sendStatus(500);
  }
}

export async function deleteRental(req, res){
  const {id} = req.params;
  try {
    await connection.query(`
      DELETE FROM rentals
      WHERE id=$1     
    `,[id]);
    
    res.sendStatus(200);
    
  } catch (e) {
    console.log("Error delete rentals.", e);
    return res.sendStatus(500);
  }
}