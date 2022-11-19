import express, { Router } from "express";
import * as userHandler from "../router_handler/user.js"; // 用戶路由處理函數

import { reg_login_schema } from "../schema/user.js"; // 用戶信息驗證
import expressJoi from "@escook/express-joi"; // 驗證表單的中間件，实现自动对表单数据进行验证的功能

// 路由對象
const router: Router = express.Router();
// 註冊新用戶 - 驗證通過後交給regUser中間件，否則交給錯誤處理中間件
router.post("/reguser", expressJoi(reg_login_schema), userHandler.regUser); // 剩下的參數爲中間件
// 登錄
router.post("/login", expressJoi(reg_login_schema), userHandler.login);

// 路由對象露出
export default router;
