import connection from "../database/db.js";
import { postCustomerSchema } from "../schemas/customersSchema.js";

export function getCustomersMiddleWare(req, res, next){
  const cpf = req.cpf || '';
  res.locals.cpf = cpf;
  next();
}

export async function getCustomerMiddleWare(req, res, next){
  try {
    const {id} = req.params;

    const customers = await connection.query(`
    SELECT * FROM customers
    WHERE id=$1
    `, [id]);
    
    if(!customers.rows[0]) return res.sendStatus(404);

    res.locals.customers = customers.rows[0];
    next();
    
  } catch (e) {
    console.log("Error MiddleWare getCustomers.", e);
    return res.sendStatus(500);
  }
}

export async function postCostumerMiddleWare(req, res, next){
  try {
    const {cpf} = req.body;

    if(!isValidCustomerBody(res, req.body)) return;

    if(isExistentsCPF(res, cpf)) return;

    next();
    
  } catch (e) {
    console.log("Error MiddleWare postCustomers.", e);
    return res.sendStatus(500);
  }
}

export async function putCustomerMiddleWare(req, res, next){
  const {cpf} = req.body;
  const {id} = req.params;
  try {
    if(!isValidCustomerBody(res, req.body));
    
    const customers = await connection.query(`
    SELECT * FROM customers
    WHERE cpf=$1 AND NOT id=$2
    `, [cpf,parseInt(id)]);
    
    if(customers.rows[0]) {
      return res.sendStatus(409);
    }
    
    next();
    
  } catch (error) {
    console.log("Error MiddleWare putCustomers.", e);
    return res.sendStatus(500);
  }
}

function isValidCustomerBody(res, body){
  const validation = postCustomerSchema.validate(body, {abortEarly: false});
  if(validation.error){
    res.status(400).send(
      validation.error.details.map(
      detail => detail.message
    ));
    return false;
  }
  return true;
}

async function isExistentsCPF(res, cpf){
  try {
    const customers = await connection.query(`
      SELECT * FROM customers
      WHERE cpf = $1
    `, [cpf]);

    if(customers.rows[0]) {
      res.sendStatus(409);
      return true;
    }
    return false;

  } catch (e) {
    console.log("Error CPF validation.", e);
    return res.sendStatus(500);
  }
}