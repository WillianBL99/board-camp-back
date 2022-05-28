import Joi from "joi";

export const postRentalSchema = Joi.number().min(1).required();