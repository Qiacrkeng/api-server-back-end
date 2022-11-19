// 優化表單數據驗證

/**
 * 单纯的使用 `if...else...` 的形式对数据合法性进行验证，
 * 效率低下、出错率高、维护性差。因此，推荐使用**第三方数据验证模块**，
 * 来降低出错率、提高验证的效率与可维护性，**让后端程序员把更多的精力放在核心业务逻辑的处理上**。
 */
import Joi from "joi"; // 为表单中携带的每个数据项，定义验证规则
import type { StringSchema } from "joi";
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用戶名的驗證規則
const username: StringSchema = Joi
  .string()
  .alphanum()
  .min(1)
  .max(10)
  .required();
// 密碼的驗證規則
const password: StringSchema = Joi
  .string()
  .pattern(/^[\S]{6,12}$/) //開頭到結尾必須是非空字符6-12位
  .required();
// nickname id email字段的驗證規則
// const id: NumberSchema = joi.number().integer().min(1).required();
const nickname: StringSchema = Joi.string().required();
const email: StringSchema = Joi.string().required();

// 用户信息验证规则模块
export const reg_login_schema = {
  body: {
    username,
    password,
  },
};
export const update_userinfo_schema = {
  body: {
    // id,
    nickname,
    email,
  },
};

export const update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: Joi.not(Joi.ref("oldPwd")), //.concat(password), // newPwd和oldPwd不能一致
  },
};

const avatar: StringSchema = Joi.string().dataUri().required(); // data url格式
export const update_avatar_schema = {
  body: {
    avatar,
  },
};
