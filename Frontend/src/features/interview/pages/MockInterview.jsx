import "../style/mockInterview.scss";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { generateQuestions, evaluateAnswer } from "../services/mockInterview.api";

const MockInterview = () => {

    // States
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [aiResult, setAiResult] = useState(null);
    const [showTips, setShowTips] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Dynamic Job Input
    const [jobDescription, setJobDescription] = useState("Frontend Developer");
    const [resumeText, setResumeText] = useState("Candidate with relevant experience");

    // Speech Recognition
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Common General Questions
    const commonQuestions = [
        {
            id: 1,
            question: "Tell me about yourself.",
            type: "common"
        },
        {
            id: 2,
            question: "What are your career goals?",
            type: "common"
        },
        {
            id: 3,
            question: "Where do you see yourself in 5 years?",
            type: "common"
        },
        {
            id: 4,
            question: "Why should we hire you?",
            type: "common"
        },
        {
            id: 5,
            question: "What are your strengths and weaknesses?",
            type: "common"
        }
    ];

    // Load Questions (Common + AI Generated)
    const loadQuestions = async () => {
        try {
            // First get AI questions
            const aiData = await generateQuestions({
                resume: resumeText,
                jobDescription: jobDescription
            });

            const aiGenerated = aiData.questions || aiData;

            // Combine: Common first, then AI questions
            const allQuestions = [...commonQuestions, ...aiGenerated];

            setQuestions(allQuestions);
            setCurrentQuestion(0);
            setAiResult(null);

            console.log(`Total Questions: ${allQuestions.length} (5 Common + ${aiGenerated.length} AI)`);
        } catch (error) {
            console.error("Failed to load questions:", error);
            alert("Questions generate karne mein problem ho rahi hai");
        }
    };

    // First Time Load
    useEffect(() => {
        loadQuestions();
    }, []);

    // Interview Tips
    const showInterviewTips = () => {
        setShowTips(true);
    };

    // End Session
    const endSession = () => {
        if (window.confirm("Kya aap session end karna chahte hain?")) {
            window.location.href = "/";
        }
    };

    // Analyze Answer
    const analyzeAnswer = async () => {
        if (!questions[currentQuestion] || !transcript.trim()) {
            alert("Please speak something before analyzing!");
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await evaluateAnswer({
                question: questions[currentQuestion].question,
                answer: transcript
            });
            setAiResult(result);
        } catch (error) {
            console.error("Evaluation Error:", error);
            alert("AI se answer analyze karne mein problem ho rahi hai");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <h2>Browser doesn't support speech recognition.</h2>;
    }

    return (
        <div className="mock-page">

            {/* TOP HEADER */}
            <div className="mock-topbar">
                <div className="logo-section">
                    <h1>
                        <span>AI</span> Mock Interview
                    </h1>
                    <div className="live-badge">
                        <div className="live-dot"></div>
                        Live Practice
                    </div>
                </div>

                <div className="top-buttons">
                    <button className="tips-btn" onClick={showInterviewTips}>
                        💡 Interview Tips
                    </button>
                    <button className="end-btn" onClick={endSession}>
                        End Session
                    </button>
                </div>
            </div>

            {/* JOB INPUT */}
            <div className="job-input-section">
                <h3>Enter Job Role / Description</h3>
                <input
                    type="text"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="e.g. Frontend Developer, Data Analyst..."
                />
                <button onClick={loadQuestions} className="next-btn">
                    Generate Questions
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="mock-grid">
                <div className="mock-left">
                    {/* Question Card */}
                    <div className="glass-card question-card">
                        <div className="question-header">
                            <h3>
                                {questions[currentQuestion]?.type === "common" 
                                    ? "Common Interview Question" 
                                    : "Job Specific Question"}
                            </h3>
                        </div>

                        <h1 className="main-question">
                            {questions[currentQuestion]?.question || "Loading Questions..."}
                        </h1>

                        <div className="control-buttons">
                            <button onClick={() => SpeechRecognition.startListening({ continuous: true, language: "en-US" })} 
                                    className="speak-btn">
                                🎤 Start Speaking
                            </button>

                            <button onClick={() => SpeechRecognition.stopListening()} 
                                    className="stop-btn">
                                ⏹ Stop
                            </button>

                            <button onClick={analyzeAnswer} 
                                    className="analyze-btn"
                                    disabled={isAnalyzing}>
                                {isAnalyzing ? "Analyzing..." : "✨ Analyze Answer"}
                            </button>

                            <button className="next-btn"
                                onClick={() => {
                                    if (currentQuestion < questions.length - 1) {
                                        setCurrentQuestion(currentQuestion + 1);
                                        resetTranscript();
                                        setAiResult(null);
                                    }
                                }}>
                                Next Question →
                            </button>
                        </div>
                    </div>

                    {/* Answer Card */}
                    <div className="glass-card answer-card">
                        <h2>Your Answer</h2>
                        <p>{transcript || "Speak something..."}</p>
                        <div className="mic-status">
                            Mic Status: <span>{listening ? "ON 🎤" : "OFF"}</span>
                        </div>
                    </div>

                    {/* Feedback Card */}
                    <div className="glass-card feedback-card">
                        <h2>AI Feedback</h2>
                        <div className="feedback-score">
                            <div className="score-circle">
                                {aiResult?.score || 0}
                            </div>
                            <div className="feedback-text">
                                <h3>{aiResult?.feedback || "Click Analyze Answer"}</h3>
                                {aiResult?.strengths && (
                                    <ul className="strengths">
                                        {aiResult.strengths.map((item, i) => <li key={i}>✔ {item}</li>)}
                                    </ul>
                                )}
                                {aiResult?.improvements && (
                                    <ul className="improvements">
                                        {aiResult.improvements.map((item, i) => <li key={i}>⚠ {item}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Same as before */}
                <div className="mock-right">
                    <div className="glass-card side-card">
                        <h3>Overall Performance</h3>
                        <div className="performance-circle">
                            {aiResult?.score || 0}%
                        </div>
                        <p>You're doing great 🚀</p>
                    </div>

                    <div className="glass-card side-card">
                        <h3>Score Breakdown</h3>
                        <div className="progress-item">
                            <span>Confidence</span>
                            <progress value={aiResult?.confidence || 0} max="100"></progress>
                            <span className="progress-value">{aiResult?.confidence || 0}%</span>
                        </div>
                        <div className="progress-item">
                            <span>Communication</span>
                            <progress value={aiResult?.communication || 0} max="100"></progress>
                            <span className="progress-value">{aiResult?.communication || 0}%</span>
                        </div>
                        <div className="progress-item">
                            <span>Grammar</span>
                            <progress value={aiResult?.grammar || 0} max="100"></progress>
                            <span className="progress-value">{aiResult?.grammar || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips Modal */}
            {showTips && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>💡 Interview Tips</h2>
                        <ul>
                            <li>Speak clearly and confidently</li>
                            <li>Understand the question properly</li>
                            <li>Give specific examples</li>
                            <li>Use STAR method</li>
                            <li>Keep answers relevant</li>
                        </ul>
                        <button onClick={() => setShowTips(false)} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockInterview;