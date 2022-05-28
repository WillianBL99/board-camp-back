import Joi from "joi";

export const postCategoriesSchema = Joi.object({
    name: Joi.string().required()
});