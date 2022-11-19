import express, { NextFunction, Request, Response } from "express";
const app = express();
// 跨域
import cors from "cors";
// 導入用戶路由模塊
import userRouter from "./router/user.js";
import userinfoRouter from "./router/userinfo.js";
import artCateRouter from "./router/artcate.js";

// 封裝一個響應處理結果函數，必須要在路由之前》，全局中間件
// app.use((request, response, next) => {
//   // status -- 0為成功，1為失敗
//   // err 也可以表示成功的訊息
//   response.cc = (err, status = 1) => {
//     response.send({
//       status,
//       message: err instanceof Error ? err.message : err,
//     });
//   };
//   next();
// });
// 註冊為中間件(處理跨域)
app.use(cors());
// 只能解析`application/x-www-form-urlencoded` 格式的請求
app.use(express.urlencoded({ extended: false }));

import config from "./router_handler/config.js"; // 導入配置文件
import { expressjwt } from "express-jwt"; // 解析Token
app.use(
  expressjwt({
    secret: config.jwtSecretKey,
    algorithms: ["HS256"], // 指定算法爲256
  }).unless({ path: [/^\/api\//] })
); // api路徑不需要被解析Token

// 全局错误级别中间件
import joi from "joi";
import articleRouter from "./router/article.js";

// 使用用戶路由
app.use("/api", userRouter);
// 權限接口，需要Token身份認證
app.use("/my", userinfoRouter);
// 文章統一article
app.use("/my/article", artCateRouter);
app.use("/my/article", articleRouter);
// uploads目錄作爲靜態資源
app.use("/uploads", express.static("./uploads"));

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    // 數據驗證失敗
    if (error instanceof joi.ValidationError) {
      return response.send({ message: error?.message, status: 1 });
    }
    // console.log(request);
    // Token認證失敗
    if (error.name === "UnauthorizedError") {
      return response.status(401).send({ message: "身份錯誤", status: 1 });
    }
    response.send({ message: error?.message, status: 1 }); // 未知的錯誤

    next(); // 否則其它中間件廢了
  }
);

app.listen(3007, () => {
  console.log(`Api Server running at http://localhost:3007`);
});
