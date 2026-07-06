const express = require("express")
const router = express.Router()

const {
    generateMockQuestionsController,
    evaluateAnswerController
} = require("../controllers/mockInterview.controller")

router.post("/questions", generateMockQuestionsController)

router.post("/evaluate", evaluateAnswerController)


module.exports = router