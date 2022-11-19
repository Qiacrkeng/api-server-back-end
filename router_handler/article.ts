import type { RequestHandler } from "express";
import path from "path";
import db from "../db/index.js";
import type { SqlQueryResult, TableEvArticles } from "../types/DB.js";
import type { HttpSend } from "../types/Http.js";
// 發佈新文章
export const addArticle: RequestHandler<
  { [key: string]: string },
  HttpSend,
  TableEvArticles
> = (request, response) => {
  // 是否上傳了封面
  if (!request.file || request.file.fieldname !== "cover_img") {
    return response.send({ status: 1, message: "文章封面是必選的參數" });
  }
  if (request.file == undefined) {
    return response.send({ status: 1, message: "錯誤" });
  }
  const articleInfo: TableEvArticles = {
    ...request.body,
    cover_img: path.join("/uploads", request.file.filename),
    pub_date: new Date(),
    author_id: request.auth?.id,
  };

  const sql: string = "INSERT INTO ev_articles SET ?";

  db.query(sql, articleInfo, (error, results: SqlQueryResult) => {
    if (error) {
      return response.send({ status: 1, message: error.message });
    }
    if (results.affectedRows !== 1) {
      return response.send({ status: 1, message: "發佈文章失敗" });
    }

    response.send({ status: 0, message: "發佈文章成功" });
  });
};
// 獲取文章的列表數據
export const getArticleList: RequestHandler<
  void,
  HttpSend,
  void,
  {
    per_page: number;
    page: number;
    cate_id: number;
    state: string;
  }
> = (request, response) => {
  const { per_page, page, cate_id, state } = request.query;

  let sql: string =
    "SELECT t1.id,title,pub_date,state,t2.name AS cate_name FROM ev_articles t1,ev_article_cate t2 WHERE t1.cate_id = ? AND state = ? AND t1.is_delete = 0 AND t1.cate_id = t2.id ORDER BY t1.id DESC";
  if (per_page > 0 && page > 0) {
    sql = `${sql} LIMIT ${(page - 1) * Number(per_page)}, ${Number(per_page)}`;
  }

  db.query(sql, [cate_id, state], (error, results: TableEvArticles[]) => {
    if (error) {
      return response.send({ status: 1, message: error.message });
    }
    db.query(
      "SELECT COUNT(*) AS maxCount FROM ev_articles t1,ev_article_cate t2 WHERE t1.cate_id = ? AND state = ? AND t1.is_delete = 0 AND t1.cate_id = t2.id ORDER BY t1.id DESC",
      [cate_id, state],
      (error, result) => {
        if (error) {
          return response.send({ status: 1, message: error.message });
        }
        response.send({
          status: 0,
          message: "獲取文章列表成功",
          data: results,
          maxCount: result[0].maxCount,
        });
      }
    );
  });
};
