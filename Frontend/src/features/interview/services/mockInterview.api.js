import axios from "axios"

const API =
"https://interview-ai-project-v4ri.onrender.com"




export const generateQuestions =
async (data) => {

    const response =
    await axios.post(
        `${API}/questions`,
        data
    )

    return response.data
}





export const evaluateAnswer =
async (data) => {

    const response =
    await axios.post(
        `${API}/evaluate`,
        data
    )

    return response.data
}