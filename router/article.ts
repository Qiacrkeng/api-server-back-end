import express, { Router } from "express";
import { addArticle, getArticleList } from "../router_handler/article.js";

// 通過multer模塊實現multipart/from-data數據格式的表單數據
import multer from "multer";
// import path, { dirname } from "path";
import expressJoi from "@escook/express-joi";
import {
  add_article_schema,
  get_article_list_schema,
} from "../schema/article.js";

// console.log(path.join(dirname(import.meta.url), "../uploads"));

// dest指定文件的存放路徑
const upload = multer({
  dest: "./uploads",
});

const router: Router = express.Router();
// 發佈新文章
router.post(
  "/add",
  // 順序不要變，因爲使用的是form-data格式
  upload.single("cover_img"), // 將文件型數據掛載到request.file中，文本則是request.body
  expressJoi(add_article_schema),
  addArticle
);
// 獲取文章列表
router.get("/list", expressJoi(get_article_list_schema), getArticleList);

export default router;
