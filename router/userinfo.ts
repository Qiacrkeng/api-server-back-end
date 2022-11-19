import express, { Router } from "express";
import * as userinfo_handler from "../router_handler/userinfo.js";
import expressJoi from "@escook/express-joi";
import {
  update_avatar_schema,
  update_password_schema,
  update_userinfo_schema,
} from "../schema/user.js";

// 個人中心

const router: Router = express.Router();
// 獲取用戶的基本信息
router.get("/userinfo", userinfo_handler.getUserInfo);
// 更新用戶的基本信息
router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema), // 先把數據驗證給對上
  userinfo_handler.updateUserinfo
);
// 重置用戶的密碼
router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  userinfo_handler.updatePassword
);
// 更新用戶頭像
router.post(
  "/update/avatar",
  expressJoi(update_avatar_schema),
  userinfo_handler.updateAvatar
);

export default router;
