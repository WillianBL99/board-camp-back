import connection from "../database/db.js";

export async function getCustomers(req, res){
  try {
    let {cpf} = res.locals;

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
  try {
    const {customers} = res.locals;

    res.send(customers);

  } catch(e){
    console.log("Error get customers.", e);
    return res.sendStatus(500);
  }
}

export async function postCustomer(req, res){  
  try {
    const {name,phone,cpf,birthday} = req.body;

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
  try {
    const {name,phone,cpf,birthday} = req.body;
    const {id} = req.params;

    await connection.query(`
      UPDATE customers
      SET 
        name=$1,
        phone=$2,
        cpf=$3,
        birthday=$4
      WHERE id=$5
    `, [name,phone,cpf,birthday, id]);

    res.sendStatus(200);

  } catch(e){
    console.log("Error put customers.", e);
    return res.sendStatus(500);
  }
}