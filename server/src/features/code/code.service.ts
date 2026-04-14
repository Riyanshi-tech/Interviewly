import axios from "axios";
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const headers = {
  "content-type": "application/json",
  "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};
export const executeCode = async (code: string) => {
  // Step 1: send code
  const response = await axios.post(
    JUDGE0_URL + "?base64_encoded=false&wait=true",
    {
      source_code: code,
      language_id: 63, // JavaScript
    },
    { headers }
  );

  return response.data;
};