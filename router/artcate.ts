import expressJoi from "@escook/express-joi";
import express, { Router } from "express";
import {
  addArticleCates,
  deleteCateById,
  getArticleById,
  getArticleCates,
  updateCateById,
} from "../router_handler/artcate.js";
import {
  add_cate_schema,
  delete_cate_schema,
  get_cate_schema,
  update_cate_schema,
} from "../schema/artcate.js";

// 文章分類管理

const router: Router = express.Router();
// 分類列表
router.get("/cates", getArticleCates);
// 文章分類
router.post("/addcates", expressJoi(add_cate_schema), addArticleCates);
// 刪除分類
router.get("/deletecate/:id", expressJoi(delete_cate_schema), deleteCateById);
// id獲得文章分類
router.get("/cates/:id", expressJoi(get_cate_schema), getArticleById);

router.post("/updatecate", expressJoi(update_cate_schema), updateCateById);

export default router;
