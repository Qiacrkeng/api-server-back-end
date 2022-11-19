import { RequestHandler } from "express";
import db from "../db/index.js";
import bcryptjs from "bcryptjs";
import { SqlQueryResult, TableEvUsers } from "../types/DB.js";
import { HttpSend } from "../types/Http.js";

export const getUserInfo: RequestHandler = (request, response) => {
  //   response.send("ok");
  // 根據ID，查詢用戶的基本信息 (千萬不要帶password)
  const sql: string = `SELECT id,username,nickname,email,user_pic FROM ev_users WHERE id = ?`;
  // console.log(request.auth);
  // user屬性是token解錫成功，express-jwt中間件掛上去的
  db.query(sql, request.auth?.id, (error, results: SqlQueryResult) => {
    if (error) {
      // 語句執行失敗
      return response.send({ status: 1, message: error?.message } as HttpSend);
    }
    // 沒有結果
    if (results.length !== 1) {
      return response.send({
        message: "獲取用戶信息失敗",
        status: 1,
      } as HttpSend);
    }
    response.send({
      status: 0,
      message: "獲取用戶基本信息成功！",
      data: results[0],
    } as HttpSend);
  });
};

// 更新用戶基本信息的處理函數
export const updateUserinfo: RequestHandler<void, HttpSend, TableEvUsers> = (
  request,
  response
) => {
  const sql: string = "UPDATE ev_users SET ? WHERE id = ?";
  const body: TableEvUsers = request.body;

  db.query(
    sql,
    [{ email: body.email, nickname: body.nickname }, request.auth?.id],
    (error, results: SqlQueryResult) => {
      if (error) {
        // 執行失敗
        return response.send({
          status: 1,
          message: error?.message,
        });
      }
      // 影響的行數
      if (results.affectedRows !== 1) {
        return response.send({
          message: "修改用戶基本信息失敗",
          status: 1,
        });
      }
      return response.send({
        status: 0,
        message: "修改用戶基本信息成功",
      });
    }
  );
};
// 重置密碼
export const updatePassword: RequestHandler = (request, response) => {
  const sql = "SELECT * FROM ev_users WHERE id = ?";

  db.query(sql, request.auth?.id, (error, results: SqlQueryResult) => {
    if (error) return response.send({ status: 1, message: error.message });

    if (results.length !== 1)
      return response.send({ status: 1, message: "用戶不存在" } as HttpSend);

    // 判斷原來的舊密碼是否正確，因爲服務器這邊存儲的是用戶加密的密碼
    const compareResult = bcryptjs.compareSync(
      request.body.oldPwd,
      results[0].password
    );
    if (!compareResult)
      return response.send({ status: 1, message: "原密碼錯誤" } as HttpSend);
    // 加密
    const newPwd: string = bcryptjs.hashSync(request.body.newPwd, 10);

    const sql: string = "UPDATE ev_users SET password = ? WHERE id = ?";
    db.query(
      sql,
      [newPwd, request.auth?.id],
      (error, results: SqlQueryResult) => {
        // 語句執行失敗
        if (error) {
          return response.send({
            status: 1,
            message: error.message,
          } as HttpSend);
        }
        if (results.affectedRows !== 1) {
          return response.send({
            status: 1,
            message: "更新密碼失敗",
          } as HttpSend);
        }

        return response.send({
          status: 0,
          message: "更新密碼成功",
        } as HttpSend);
      }
    );
  });
};
// 更新頭像
export const updateAvatar: RequestHandler = (request, response) => {
  const sql: string = "UPDATE ev_users SET user_pic = ? WHERE id = ?";

  db.query(
    sql,
    [request.body.avatar, request.auth?.id],
    (error, results: SqlQueryResult) => {
      if (error) {
        return response.send({ status: 1, message: error.message } as HttpSend);
      }
      if (results.affectedRows !== 1) {
        return response.send({
          status: 1,
          message: "更新頭像失敗",
        } as HttpSend);
      }

      return response.send({ status: 0, message: "更新頭像成功" } as HttpSend);
    }
  );
};
