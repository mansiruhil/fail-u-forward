const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY=process.env.NEXT_PUBLIC_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const validate = async (req, res) => {
  let text = req.body;
  console.log(text) 
  console.log(typeof(JSON.stringify(text)))

    text=JSON.stringify(text)
    try {
    console.log("Sending request to Gemini API:", { text });
    const prompt=`Evaluate the statement below and figure out if it is sad or not .send 0 if Not sad else send 1 and the statement is ${text}. return as 1 or 0 only. no other text`
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);


    console.log(result.response.text())
  
    const response = result.response.text()
    console.log(response)
    console.log("Gemini API Response:", response);

  return res.status(200).json(response)
  } catch (error) {
    console.error("Error while calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

const chatbot=async(req,res)=>{
let text=req.body
console.log(typeof(JSON.stringify(text)))
text=JSON.stringify(text)
try{
    console.log("Sending request to Gemini API:", { text });
    const prompt=`you are consoling this user and give him some good advice and motivate him.give me a reply of 20 words
    user: ${text}`
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    const response = result.response.text()
    console.log(response)
    console.log("Gemini API Response:", response);
    return res.status(200).json(response)
}catch (error) {
    console.error("Error while calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}


module.exports = { validate,chatbot};
