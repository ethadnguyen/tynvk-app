import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists().withMessage("Tên đăng nhập là bắt buộc")
    .isLength({ min: 8 }).withMessage("Tên đăng nhập phải có ít nhất 8 kí tự")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("Tên đã được sử dụng!");
    }),
  body("password")
    .exists().withMessage("Mật khẩu là bắt buộc")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 kí tự"),
  body("confirmPassword")
    .exists().withMessage("Xin nhập lại mật khẩu")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 kí tự")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Mật khẩu không trùng khớp");
      return true;
    }),
  body("displayName")
    .exists().withMessage("Tên tài khoản là bắt buộc")
    .isLength({ min: 8 }).withMessage("Tên tài khoản phải có ít nhất 8 kí tự"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("Tên đăng nhập là bắt buộc")
    .isLength({ min: 8 }).withMessage("tên đăng nhập phải có ít nhất 8 kí tự"),
  body("password")
    .exists().withMessage("Mật khẩu là bắt buộc")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 kí tự"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists().withMessage("Mật khẩu là bắt buộc")
    .isLength({ min: 8 }).withMessage("mật khẩu phải có ít nhất 8 kí tự"),
  body("newPassword")
    .exists().withMessage("Xin nhập mật khẩu mới")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 kí tự"),
  body("confirmNewPassword")
    .exists().withMessage("Xin nhập lại mật khẩu")
    .isLength({ min: 8 }).withMessage("Mật khẩu phải có ít nhất 8 kí tự")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("Mật khẩu không trùng khớp");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get(
  "/info",
  tokenMiddleware.auth,
  userController.getInfo
);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  body("mediaRate")
    .exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;