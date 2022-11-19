# 文章管理系统 - 后端

## 技术栈

- Express - 后端服务器框架
- mysql - 数据库（本人开发用的是 5.x，8.x 需要额外设置）
- bcryptjs - 数据加密库
- multer - form-data 格式处理
- Axios - 网络 Api 封装库
- cors - 开启跨域的 express 中间件
- joi - 数据规则验证库
- express-joi - 根据 joi 库封装为 express 中间件
- express-jwt - express 的 jwt 中间件
- jsonwebtoken - jwt 数据处理库

## 开始

1. 需要下载依赖

```
npm install
```

或者

```
yarn
```

2. 下载 TypeScript 全局转义工具

```
npm install tsc -g
```

3. 进行开发者构建运行

```
npm run dev
```

或者

```
yarn dev
```

## 项目介绍

[B 站链接](https://www.bilibili.com/video/BV1a34y167AZ/)

> 原本是黑马程序员 node 课程的一个案例项目，在某天学习时发现这个小项目可以重构一下，于是我将后台用 TypeScript 重构了。

> 前端原本是用的 JQuery + layui，我发现这个真的太简单也不符合主流技术潮流。因此我自己写了前台的页面，使用 Vite 构建工具会比手动引入 js 效率高很多。

`功能：文章发布、分类管理、账户信息更改`

[前端项目链接](https://github.com/Qiacrkeng/api-server)

> 项目目前还剩下一点需求未实现，大部分都已实现
