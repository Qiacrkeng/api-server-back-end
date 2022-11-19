import Joi, { NumberSchema, StringSchema } from "joi";

const title: StringSchema = Joi.string().required();
const cate_id: NumberSchema = Joi.number().integer().min(1).required();
const content: StringSchema = Joi.string().allow("");
const state: StringSchema = Joi.string().valid("已發佈", "草稿").required();

export const add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
};

const per_page = Joi.number();
const page = Joi.number();

export const get_article_list_schema = {
  query: {
    cate_id,
    state,
    per_page,
    page,
  },
};
