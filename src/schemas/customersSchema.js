import Joi from "joi";

export const postCustomerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  phone: Joi.string().min(10).max(11).required(),
  cpf: Joi.string().length(11),
  birthday: Joi.date().raw().required()
})