import db from "../db/index.js";
// 给用户密码加密
import bcrypt from "bcryptjs";
// 生成Token字符串
import jwt from "jsonwebtoken";
// 導入配置文件
import config from "./config.js";
import { RequestHandler } from "express";
import { HttpBody, HttpSend } from "../types/Http.js";

// 註冊用戶的處理函數
export const regUser: RequestHandler = (request, response) => {
  // 1sdasadsa
  // 喜歡萬小姐姐sdasadsads
  const userInfo: HttpBody = request.body;
  const sqlStr: string = `SELECT * FROM ev_users WHERE username = ?`;
  if (!userInfo || !userInfo.username || !userInfo.password) {
    return response.send({ status: 1, message: "用户名或密码不能为空" });
  }
  db.query(sqlStr, userInfo.username, (err, results) => {
    // 查詢失敗
    if (err) {
      return response.send({
        status: 1,
        message: err.message,
      });
    }
    // 用戶被佔用
    if (results.length > 0) {
      return response.send({
        status: 1,
        message: "用戶名被佔用，請更換其他用戶名！",
      });
    }
    // 加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);

    // console.log(request.auth);

    // 插入
    const sql: string = `INSERT INTO ev_users SET ?`;
    db.query(
      sql,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        if (err) return response.send({ status: 1, message: err.message });
        // 影响的行数不为1
        if (results.affectedRows !== 1) {
          // return response.cc("註冊用戶失敗，請稍後再試");
          return response.send({
            status: 1,
            message: "註冊用戶失敗，請稍後再試",
          });
        }
        // response.cc("註冊成功！", 0);
        response.send({ status: 0, message: "註冊成功！" });
      }
    );
  });
};

// 登錄的處理函數
export const login: RequestHandler = (request, response) => {
  const userInfo = request.body; // 拿取響應體
  const sql: string = `SELECT * FROM ev_users WHERE username = ?`;

  db.query(sql, userInfo.username, (error, results) => {
    // SQL語句無法執行
    if (error) response.send({ message: error.message, status: 1 });
    // 用戶名不存在或者是數據不規範存儲
    if (results.length !== 1)
      // response.cc("登錄失敗");
      response.send({ status: 1, message: "登錄失敗" } as HttpSend);

    // 密碼是否正確，加密前後
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );

    if (!compareResult) {
      //response.cc("密碼錯誤");
      response.send({ status: 1, message: "密碼錯誤" } as HttpSend);
      return;
    }
    // ! 這就是掛載jwt核心內容，username是不重複的，因此可以通過這個獲取id
    // 登錄成功，生成Token字符串，替除密碼和頭像
    const user = { ...results[0], password: "", user_pic: "" };
    // 生成 Token 字符串
    const tokenString = jwt.sign(
      user, // payload -- 特定數據
      config.jwtSecretKey, // 伺服器JWT密碼
      {
        // header -- 算法
        expiresIn: "10h",
      }
    );
    response.send({
      status: 0,
      message: "登錄成功",
      token: `Bearer ${tokenString}`, // 送回給客戶端的Token
    } as HttpSend);
  });
};

// JWT 是 Json Web Token
