import axios from "axios"

const API =
"http://localhost:3000/mock-interview"




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