const { generateMockQuestions, evaluateAnswer } = require("../services/mockInterview.service");

async function generateMockQuestionsController(req, res) {
    try {
        const { resume, jobDescription } = req.body;

        const result = await generateMockQuestions({ resume, jobDescription });

        res.status(200).json(result);        // ← Important: direct result bhej rahe hain
    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ message: err.message });
    }
}

async function evaluateAnswerController(req, res) {
    try {
        const { question, answer } = req.body;
        const feedback = await evaluateAnswer({ question, answer });
        res.status(200).json(feedback);
    } catch (err) {
        console.error("Evaluate Error:", err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    generateMockQuestionsController,
    evaluateAnswerController
};