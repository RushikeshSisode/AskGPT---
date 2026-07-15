import axios from "axios";
import mongoose from "mongoose";
import genAI from "../configs/Gemini.js";
import imagekit from "../configs/ImageKit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-3.1-flash-lite";

const refundCredits = async (userId, amount) => {
  await User.updateOne({ _id: userId }, { $inc: { credits: amount } });
};

async function generateTextWithGemini(prompt, chat) {
  const model = genAI.getGenerativeModel({ model: TEXT_MODEL });

  const contents = [
    ...chat.messages.slice(-10).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  try {
    const result = await model.generateContent({ contents });
    const response = await result.response;

    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join(" ")
        .trim() || "";

    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    return text;
  } catch (error) {
    const apiError =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error.message;

    throw new Error(apiError);
  }
}

export const messageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    const { prompt } = req.body;

    if (!prompt || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Prompt and chatId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chatId",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const creditResult = await User.updateOne(
      { _id: userId, credits: { $gte: 1 } },
      { $inc: { credits: -1 } }
    );

    if (!creditResult.modifiedCount) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits",
      });
    }

    if (chat.chatname === "New Chat" && chat.messages.length === 0) {
      chat.chatname = prompt.split(" ").slice(0, 6).join(" ").slice(0, 30);
    }

    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    };

    let aiText;
    try {
      aiText = await generateTextWithGemini(prompt, chat);
    } catch (error) {
      await refundCredits(userId, 1);
      console.error("Gemini Error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "AI failed to respond",
      });
    }

    const reply = {
      role: "assistant",
      content: aiText,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(userMessage, reply);
    chat.updatedAt = Date.now();

    try {
      await chat.save();
    } catch (error) {
      await refundCredits(userId, 1);
      throw error;
    }

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Message Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    const { prompt, isPublished } = req.body;

    if (!prompt || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Prompt and chatId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chatId",
      });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const creditResult = await User.updateOne(
      { _id: userId, credits: { $gte: 2 } },
      { $inc: { credits: -2 } }
    );

    if (!creditResult.modifiedCount) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits",
      });
    }

    if (chat.chatname === "New Chat" && chat.messages.length === 0) {
      chat.chatname = prompt.split(" ").slice(0, 6).join(" ").slice(0, 30);
    }

    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    };

    const safePrompt = encodeURIComponent(prompt.trim());
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${safePrompt}/askvision/${Date.now()}.png?tr=w-800,h-800`;

    let upload;
    try {
      const aiImage = await axios.get(generatedImageUrl, {
        responseType: "arraybuffer",
      });

      const base64Image = `data:image/png;base64,${Buffer.from(
        aiImage.data
      ).toString("base64")}`;

      upload = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder: "askvision",
      });
    } catch (error) {
      await refundCredits(userId, 2);
      throw error;
    }

    const reply = {
      role: "assistant",
      content: upload.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    chat.messages.push(userMessage, reply);
    chat.updatedAt = Date.now();

    try {
      await chat.save();
    } catch (error) {
      await refundCredits(userId, 2);
      throw error;
    }

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Image Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
