import db from "../db/index.js";

import type { RequestHandler } from "express";
import type { MysqlError } from "mysql";
import type { SqlQueryResult, TableEvArticleCates } from "../types/DB.js";
import type { HttpSend } from "../types/Http.js";
// 獲取文章分類列表
export const getArticleCates: RequestHandler<
  void,
  HttpSend,
  void,
  { per_page: number; page: number }
> = (request, response) => {
  // 每頁數量，當前頁
  const { per_page, page } = request.query;
  // 如果沒有查詢參數直接返回所有內容
  let sql: string = `SELECT * FROM ev_article_cate WHERE is_delete = 0 ORDER BY id ASC`;
  if (page > 0 && per_page > 0) {
    sql = `${sql} LIMIT ${(page - 1) * per_page}, ${per_page}`;
  }

  db.query(sql, (error: MysqlError, results: SqlQueryResult) => {
    if (error) {
      return response.send({ status: 1, message: error.message });
    }
    db.query(
      "SELECT COUNT(*) AS maxCount FROM ev_article_cate WHERE is_delete = 0",
      (error, result) => {
        if (error) {
          return response.send({ status: 1, message: error.message });
        }
        response.send({
          status: 0,
          message: "獲取文章分類列表成功！",
          data: results,
          maxCount: result[0].maxCount,
        });
      }
    );
  });
};
// 添加文章分類
export const addArticleCates: RequestHandler = (request, response) => {
  // 檢查是否被佔用
  const sql: string =
    "SELECT * FROM ev_article_cate WHERE name = ? OR alias = ?";

  const body: TableEvArticleCates = request.body;

  db.query(
    sql,
    [body.name, body.alias],
    (error, results: TableEvArticleCates[]) => {
      if (error) {
        response.send({ status: 1, message: error.message } as HttpSend);
      }

      if (results.length === 2) {
        return response.send({
          message: "分類名稱與別名被佔用，請更換後重試",
          status: 1,
        } as HttpSend);
      }
      if (results.length === 1 && results[0].name === body.name) {
        return response.send({
          status: 1,
          message: "分類名稱被佔用，請更換後重試！",
        } as HttpSend);
      }
      if (results.length === 1 && results[0].alias === body.alias) {
        return response.send({
          status: 1,
          message: "分類別名被佔用，請更換後重試！",
        } as HttpSend);
      }

      const sql: string = "INSERT INTO ev_article_cate SET ?";
      db.query(sql, body, (error, results: SqlQueryResult) => {
        // sql語句出錯
        if (error) {
          return response.send({
            status: 1,
            message: error.message,
          } as HttpSend);
        }

        if (results.affectedRows !== 1) {
          return response.send({
            status: 1,
            message: "新增文章分類失敗",
          } as HttpSend);
        }

        return response.send({
          status: 0,
          message: "新增文章分類成功",
        } as HttpSend);
      });
    }
  );
};
// 通過id進行刪除文章分類
export const deleteCateById: RequestHandler<{ id: number }> = (
  request,
  response
) => {
  // 置爲刪除狀態
  const sql: string = "UPDATE ev_article_cate SET is_delete = 1 WHERE id = ?";
  const params = request.params;
  console.log(params);

  db.query(sql, params.id, (error, results: SqlQueryResult) => {
    if (error) {
      return response.send({ status: 1, message: error.message } as HttpSend);
    }
    if (results.affectedRows !== 1) {
      return response.send({
        status: 1,
        message: "刪除文章分類失敗",
      } as HttpSend);
    }
    response.send({ status: 0, message: "刪除文章分類成功" } as HttpSend);
  });
};
// 用id獲取文章分類
export const getArticleById: RequestHandler<{ id: number }, HttpSend> = (
  request,
  response
) => {
  const sql: string = "SELECT * FROM ev_article_cate WHERE id = ?";
  const paramsID = request.params.id;

  db.query(sql, paramsID, (error, results: TableEvArticleCates[]) => {
    if (results.length !== 1) {
      return response.send({ status: 1, message: "獲取文章分類數據失敗" });
    }
    response.send({
      status: 0,
      message: "獲取文章分類數據成功",
      data: results[0],
    });
  });
};
// 以id更新文章的分類訊息
export const updateCateById: RequestHandler<
  void,
  HttpSend,
  TableEvArticleCates
> = (request, response) => {
  const sql: string =
    "SELECT * FROM ev_article_cate WHERE id <> ? AND (name = ? OR alias = ?)";

  const body = request.body;
  db.query(
    sql,
    [body.id, body.name, body.alias],
    (error, results: TableEvArticleCates[]) => {
      if (error) {
        return response.send({ status: 1, message: error.message });
      }

      if (results.length === 2) {
        return response.send({
          message: "分類名稱與別名已被佔用，請更換後重試！",
          status: 1,
        });
      }
      if (results.length === 1 && results[0].name === body.name) {
        return response.send({
          status: 1,
          message: "分類名稱被佔用，請更換後重試！",
        } as HttpSend);
      }
      if (results.length === 1 && results[0].alias === body.alias) {
        return response.send({
          status: 1,
          message: "分類別名被佔用，請更換後重試！",
        } as HttpSend);
      }
      // 沒有衝突的情況下再進行sql操作
      const sql: string = "UPDATE ev_article_cate SET ? WHERE id = ?";
      db.query(
        sql,
        [{ name: body.name, alias: body.alias }, body.id],
        (error, results: SqlQueryResult) => {
          if (error) {
            response.send({ status: 1, message: error.message });
          }
          // console.log(results);

          if (results.affectedRows !== 1) {
            response.send({
              status: 1,
              message: "更新文章失敗！",
            });
          }
          response.send({ status: 0, message: "更新文章分類成功" });
        }
      );
    }
  );
};
