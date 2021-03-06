import connection from "../database/db.js";
import {postCategoriesSchema} from "../schemas/categoriesSchema.js";

export async function postCategoriesMiddleWare(req, res, next){
  try {
    const validation = postCategoriesSchema.validate(req.body, {abortEarly: false});
    if(validation.error){
      return res.sendStatus(400);
    }

    const {name} = req.body;

    const category = await connection.query(`
      SELECT * FROM categories WHERE name = $1
    `, [name]);

    if(category.rows[0]) return res.sendStatus(409);

    next();
    
  } catch (e) {
    console.log("Error categoriesMiddleWare.", e);
    return res.sendStatus(500);
  }
}