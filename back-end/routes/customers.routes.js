const express = require("express");
const router= express.Router();

const customersController = require("../controllers/customers.controller")
const auth = require("../middleware/auth.middleware")

router.post('/signup', customersController.signup);
router.get('/',customersController.getAllUsers);
router.post("/addIntervention/:id",customersController.addIntervention);
router.get("/getIntervention/:id",customersController.getInterventions)
router.get("/getOneIntervention/:id",customersController.getOneIntervention)

module.exports = router;