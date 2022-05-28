import connection from "../database/db.js";

export async function getCustomers(req, res){
  let {cpf} = req.query;
  if(!cpf) cpf = '';

  try {
    const customers = await connection.query(`
      SELECT * FROM customers
      WHERE cpf LIKE $1
    `, [`${cpf}%`]);

    res.send(customers.rows);

  } catch(e){
    console.log("Error get customers.", e);
    return res.sendStatus(500);
  }
}

export async function getCustomer(req, res){
  const {id} = req.params;
  try {
    const customers = await connection.query(`
    SELECT * FROM customers
    WHERE id=$1
    `, [id]);
    
    if(!customers.rows[0]) return res.sendStatus(404);

    res.send(customers.rows[0]);

  } catch(e){
    console.log("Error get customers.", e);
    return res.sendStatus(500);
  }
}

export async function postCustomer(req, res){
  const {name,phone,cpf,birthday} = req.body;
  //FIXME: JOI

  try {
    const customers = await connection.query(`
      SELECT * FROM customers
      WHERE cpf = $1
    `, [cpf]);

    if(customers.rows[0]) return res.sendStatus(409);

    await connection.query(`
      INSERT INTO customers
      (name, phone, cpf, birthday)
      VALUES ($1, $2, $3, $4)
    `,[name, phone, cpf, birthday]);

    res.sendStatus(201);

  } catch(e){
    console.log("Error post customers.", e);
    return res.sendStatus(500);
  }
}

export async function putCustomer(req, res){
  const {name,phone,cpf,birthday} = req.body;
  const {id} = req.params;

  try {
    const customersId = await connection.query(`
      SELECT * FROM customers
      WHERE id = $1
    `, [id]);

    if(!customersId.rows[0]) return res.sendStatus(404);
    
    const customersCPF = await connection.query(`
      SELECT * FROM customers
      WHERE cpf = $1
    `, [cpf]);

    if(customersCPF.rows[0]) return res.sendStatus(409);

    res.sendStatus(200);

  } catch(e){
    console.log("Error put customers.", e);
    return res.sendStatus(500);
  }
}