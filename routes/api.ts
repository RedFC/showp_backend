import expess from "express";
import { connectionRouter } from "../app/http/controller/api/connection";
import { connectionAdminRouter } from "../app/http/controller/api/connection/admin";
import { userRouter } from "../app/http/controller/api/user";
import { blockedRouter } from "../app/http/controller/api/blocked";
import { categoryRouter } from "../app/http/controller/api/category";
import { userAdminRouter } from "../app/http/controller/api/user/admin";
import { productRouter } from "../app/http/controller/api/product";
import { productAdminRouter } from "../app/http/controller/api/product/admin/index";
import { reviewRouter } from "../app/http/controller/api/review/index";
import { commentsRouter } from "../app/http/controller/api/comments/index";
import { AdminsettingsRouter } from "../app/http/controller/api/settings/admin/index";
import { orderRouter } from "../app/http/controller/api/order";
import { reportRouter } from "../app/http/controller/api/report";
import { reportAdminRouter } from "../app/http/controller/api/report/admin";
import { orderAdminRouter } from "../app/http/controller/api/order/admin";
import { tncAdminRouter } from "../app/http/controller/api/tnc/admin";
import { UserReviewRouter} from "../app/http/controller/api/userReview";
import {roomRouter} from "../app/http/controller/api/rooms";

const app = expess();

app.use("/users", userRouter);
app.use('/blockUser', blockedRouter);
app.use('/category', categoryRouter);
app.use("/connections", connectionRouter);
app.use("/product", productRouter);
app.use("/review", reviewRouter);
app.use("/comments", commentsRouter);
app.use("/order", orderRouter);
app.use("/report", reportRouter);
app.use("/sellereview",UserReviewRouter);
app.use("/room",roomRouter);
// ADMIN ROUTES

app.use("/admin/product",productAdminRouter);
app.use("/admin/settings",AdminsettingsRouter);
app.use("/users/admin", userAdminRouter);
app.use("/connections/admin", connectionAdminRouter);
app.use("/admin/report", reportAdminRouter);
app.use("/admin/order", orderAdminRouter);
app.use("/admin/tnc", tncAdminRouter);


module.exports = app;