import express from "express";

import user from "./user/user.controller";
import session from "./session/session.controller"
const handleRouter= express.Router();

handleRouter.use(
    "/userapi",
    //@ts-ignore
    //   allowAdmin,
    // #swagger.tags = ['admin']
    user
  );
  handleRouter.use(
    "/sessionapi",
    //@ts-ignore
    //   allowAdmin,
    // #swagger.tags = ['admin']
    session
  );
 export default handleRouter;