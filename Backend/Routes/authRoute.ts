import { Router } from "express";
import { forgetPassword, login, resetCode, signup, verifyResetCode } from "../controllers/authorization";
import { loginValidator, resetCodeValidator, sendMailValidator, signupValidator } from "../utils/validator/authValidator";

const authRoute: Router = Router();

authRoute.route('/signup').post(signupValidator, signup);
authRoute.route('/login').post(loginValidator, login);
authRoute.route('/forgetPassword').post(sendMailValidator, forgetPassword);
authRoute.route('/verifyCode').post(verifyResetCode);
authRoute.route('/resetCode').put(resetCodeValidator, resetCode);

export default authRoute;