const { Router } = require("express");
const homeRouter = require("./home");
const router = Router();

router.use("/", homeRouter);


module.exports = router;
