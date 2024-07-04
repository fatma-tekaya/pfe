const Conversation = require("../models/Conversation");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const User = require("../models/User");
const Patient = require("../models/Patient");

// Function to generate initial history
const generateInitialHistory = () => {
  return [
    {
      role: "user",
      parts: [
        {
          text: 'You are a Healthcare Service an AI assistant expert in medical health \nYou know about symptoms and signs of various types of illnesses.\nYou can provide expert advice on self diagnosis options in the case where an illness can be treated using a home remedy.\n if a query requires serious medical attention with a doctor, recommend them to book an appointment with a doctor or call the emergency if needed \n If you are asked a question that is not related to medical health respond with "Im sorry but your question is beyond my functionalities".\n do not use external URLs or blogs to refer\nFormat any lists on individual lines with a dash and a space in front of each line.',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "- I am a Healthcare Service, and I am an AI assistant, well versed in medical matters.\n- I would be delighted to assist you with information on symptoms, signs of different illnesses, and self-diagnosis when applicable.\n- If the applicable illness can be treated using a home remedy, I will be pleased to guide you through the process.\n- I highly recommend scheduling an appointment with a doctor immediately if a condition requires serious medical attention.\n- Unfortunately, I am unable to assist you with matters outside the realm of medical health.\n- Please feel at ease to ask any questions you may have regarding medical health, and I will be glad to support you.",
        },
      ],
    },
  ];
};

exports.handleMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    const user = await Patient.findById(userId);
    const fullname = user.fullname;
    const conversationId = req.params.conversationId;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({ success: false, message: "Conversation not found or access denied." });
      }
      conversation.messages.push({ sender: fullname, text: message });
    } else {
      conversation = new Conversation({
        userId,
        messages: [{ sender: fullname, text: message }]
      });
    }

    await conversation.save();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      initialHistory: generateInitialHistory(),
      history: conversation.messages,
    });

    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const prepareHistoryForChat = (conversation) => {
      const initialHistoryParts = generateInitialHistory();
      const conversationHistoryParts = [];
      
      // Ensure proper alternation of roles
      conversation.messages.forEach((msg, index) => {
        conversationHistoryParts.push({
          role: msg.sender === fullname ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      });
      
      // Combine initial history with conversation history
      return initialHistoryParts.concat(conversationHistoryParts);
    };

    const fullHistory = prepareHistoryForChat(conversation);

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      initialHistory: generateInitialHistory(),
      history: fullHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.candidates[0].content.parts[0].text;

    conversation.messages.push({ sender: "AI", text: response });
    await conversation.save();

    res.status(200).json({ success: true, conversationId: conversation._id, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while processing the request." });
  }
};


exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Conversation.findByIdAndDelete(conversationId);
    res.status(200).json({ success: true, message: "Conversation deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete the conversation."
    });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure that the user ID is correctly extracted from the JWT token
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    const conversationPreviews = conversations.map(convo => ({
      conversationId: convo._id,
      lastMessage: convo.messages.slice(-1)[0]?.text || "No messages",
      createdAt: convo.createdAt // Include createdAt field
    }));
    res.status(200).json({ success: true, conversations: conversationPreviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch conversations." });
  }
};


exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }
    res.status(200).json({ success: true, messages: conversation.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the conversation." });
  }
};
