import connection from "../database/db.js";

export async function getCategories(req,res){
  try {
    const categories = await connection.query(`
      SELECT * FROM categories
    `);

    res.send(categories.rows);
    
  } catch (e) {
    console.log("Error get categories.", e);
    return res.sendStatus(500);
  }
}

export async function postCategory(req,res){
  try{
    const {name} = req.body;
    await connection.query(` 
      INSERT INTO categories (name)
      VALUES ($1)
    `, [name]);

    res.sendStatus(201);

  } catch (e){
    console.log("Error post categories.", e);
    return res.sendStatus(500);
  }
}