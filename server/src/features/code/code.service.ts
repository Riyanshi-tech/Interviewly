import axios from "axios";

export const executeCode = async (code: string) => {
  const response = await axios.post(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      source_code: code,
      language_id: 63, 
    }
  );

  return response.data;
};