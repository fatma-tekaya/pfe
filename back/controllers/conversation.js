const Conversation = require("../models/Conversation");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const Patient = require("../models/Patient");
const { db } = require('../firebase/index');

// List of healthcare-related keywords
const healthKeywords = [
    'health', 'medicine', 'doctor', 'symptom', 'diagnosis', 'treatment', 'home remedies', 'healtcare', 'advice',
    'illness', 'disease', 'pain', 'injury', 'medical', 'surgery', 'temperaure', 'heart rate', 'SPO2 level'
];

// Fetch user data by email from Firebase
const fetchUserDataByEmail = async (email) => {
    const snapshot = await db.ref(`patients`).orderByChild('email').equalTo(email).once('value');
    return snapshot.exists() ? snapshot.val()[Object.keys(snapshot.val())[0]] : null;
};

// Generate messages based on vital signs
const generateVitalsMessage = (vitals) => {
    if (!vitals) return { vitalsMessage: 'No vital signs available.', abnormalMessage: '' };

    let messages = [], abnormalMessages = [];
    if (vitals.heartRate) {
        let heartRateMsg = `heart rate at ${vitals.heartRate} bpm`;
        messages.push(heartRateMsg);
        if (vitals.heartRate > 100 || vitals.heartRate < 60) {
            abnormalMessages.push(`Your heart rate at ${vitals.heartRate} bpm is abnormal.`);
        }
    }
    if (vitals.spo2) {
        let spo2Msg = `SPO2 level at ${vitals.spo2}%`;
        messages.push(spo2Msg);
        if (vitals.spo2 < 95) {
            abnormalMessages.push(`Your SPO2 level at ${vitals.spo2}% is below normal.`);
        }
    }
    if (vitals.temp) {
        let tempMsg = `body temperature at ${vitals.temp}°C`;
        messages.push(tempMsg);
        if (vitals.temp > 37.5 || vitals.temp < 36.1) {
            abnormalMessages.push(`Your body temperature at ${vitals.temp}°C is abnormal.`);
        }
    }
    return { vitalsMessage: messages.join(', '), abnormalMessage: abnormalMessages.join(' ') };
};

// Generate initial history for chat based on user's vitals
const generateInitialHistory = async (userId) => {
    const user = await Patient.findById(userId);
    if (!user) {
        console.error("User not found");
        return [];
    }
    const userData = await fetchUserDataByEmail(user.email);
    if (!userData || !userData.vitals) {
        console.error("No userData or vitals found");
        return [];
    }

    const { vitalsMessage, abnormalMessage } = generateVitalsMessage(userData.vitals);
    let greeting = `Hi ${user.fullname}, how can I help you with your health concerns today?`;

    if (abnormalMessage) {
        greeting = `Hi ${user.fullname}, ${abnormalMessage} How can I help you with your health concerns today?`;
    }

    return [
        {
            role: "user",
            parts: [
                { text: "Hi health AI assistant" }
            ]
        },
        {
            role: "model",
            parts: [
                { text: greeting }
            ]
        }
    ];
};

const isHealthcareRelated = (message) => {
    return healthKeywords.some(keyword => message.toLowerCase().includes(keyword));
};

exports.handleMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await Patient.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const fullname = user.fullname;
        const conversationId = req.params.conversationId;
        let conversation;

        if (conversationId) {
            conversation = await Conversation.findOne({ _id: conversationId, userId });
            if (!conversation) {
                return res.status(404).json({ success: false, message: "Conversation not found or access denied." });
            }
            conversation.messages.push({ sender: fullname, text: req.body.message });
        } else {
            // Start a new conversation with the initial user message and the AI's greeting
            const initialHistory = await generateInitialHistory(userId);

            // Add the initial user message from history
            conversation = new Conversation({
                userId,
                messages: [
                    { sender: fullname, text: initialHistory[0].parts[0].text }
                ]
            });

            // Respond with the AI's greeting
            conversation.messages.push({
                sender: "AI",
                text: initialHistory[1].parts[0].text
            });

            await conversation.save();

            return res.status(200).json({ success: true, conversationId: conversation._id, response: initialHistory[1].parts[0].text });
        }

        await conversation.save();

        // Check if the user's message is healthcare-related
        if (!isHealthcareRelated(req.body.message)) {
            const nonHealthResponse = "I'm sorry, but I can only assist with healthcare-related questions.";
            conversation.messages.push({ sender: "AI", text: nonHealthResponse });
            await conversation.save();
            return res.status(200).json({ success: true, conversationId: conversation._id, response: nonHealthResponse });
        }

        // Prepare the conversation history for AI processing
        const conversationHistoryParts = conversation.messages.map((msg) => ({
            role: msg.sender === fullname ? "user" : "model",
            parts: [{ text: msg.text }],
        }));

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-latest",
            initialHistory: conversationHistoryParts,
            history: conversation.messages,
        });

        const generationConfig = {
            temperature: 1,
            topK: 0,
            topP: 0.95,
            maxOutputTokens: 200, // Allow the AI to produce a slightly longer response naturally
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            initialHistory: conversationHistoryParts,
            history: conversationHistoryParts,
        });

        const result = await chat.sendMessage(req.body.message);
        let response = result.response.candidates[0].content.parts[0].text;

        // Ensure the response is naturally short and concise
        const maxLength = 200; // Set the maximum length of the response
        if (response.length > maxLength) {
            // Attempt to cut off at the last sentence boundary
            const sentenceEnd = response.lastIndexOf('.', maxLength);
            response = response.substring(0, sentenceEnd > -1 ? sentenceEnd + 1 : maxLength);
        }

        // Save the AI's response to the conversation
        conversation.messages.push({ sender: "AI", text: response });
        await conversation.save();

        res.status(200).json({ success: true, conversationId: conversation._id, response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while processing the request." });
    }
};


// Delete a conversation
exports.deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        await Conversation.findByIdAndDelete(conversationId);
        res.status(200).json({ success: true, message: "Conversation deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete the conversation." });
    }
};

// Fetch all conversations for a user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
        const conversationPreviews = conversations.map(convo => ({
            conversationId: convo._id,
            lastMessage: convo.messages.slice(-1)[0]?.text || "No messages",
            createdAt: convo.createdAt
        }));
        res.status(200).json({ success: true, conversations: conversationPreviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch conversations." });
    }
};

// Get a single conversation by ID
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
