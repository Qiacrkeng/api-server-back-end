import Joi, { NumberSchema, StringSchema } from "joi";

// 分類名稱和分類別名
const name: StringSchema = Joi.string().required();
const alias: StringSchema = Joi.string().alphanum().required(); // 只能是字母和數字

export const add_cate_schema = {
  body: {
    name,
    alias,
  },
};

const id: NumberSchema = Joi.number().integer().min(1).required();

export const delete_cate_schema = {
  params: {
    id,
  },
};

export const get_cate_schema = {
  params: {
    id,
  },
};

export const update_cate_schema = {
  body: {
    id,
    name,
    alias,
  },
};
