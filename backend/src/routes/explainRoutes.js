const express = require("express");
const { explainController } = require("../controllers/explainController");

const router = express.Router();

router.post("/", explainController);

module.exports = router;