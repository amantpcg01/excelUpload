const {Router} = require("express");
const {HomeController} = require("../controllers");
const uploadExcel = require("../middlewares/upload.middleware");
const {validate} = require("../middlewares/validation.middleware");
const auth = require("../middlewares/auth.middleware");

const homeRouter = Router();
homeRouter.get("/home", HomeController.getData);
homeRouter.post("/uploadExcel", uploadExcel, HomeController.uploadExcel);
homeRouter.post("/crud/insert", HomeController.insert);
homeRouter.get("/crud/list", auth, HomeController.list);
homeRouter.post("/crud/register", HomeController.register);
homeRouter.post("/crud/login", HomeController.login);
homeRouter.post("/push-notification", HomeController.pushNotification);

module.exports = homeRouter;
// export default homeRouter;
