"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const Chatbot = () => {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(
    "You are Sadbot, a chatbot that empathizes with sadness and provides comforting advice. BUT DONT BE TOO CArried away while doing so...answer to the point while maintaining the empathy"
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    if (chatHistory.length > 0 || isLoading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory, isLoading]);

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(scrollToBottom, 200);
      inputRef.current?.focus();
    }
  }, [isChatOpen, chatHistory.length]);

  if (pathname !== "/") return null;

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    const newMessage: ChatMessage = {
      sender: "user",
      text: currentMessage,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentMessage, prompt }),
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data?.response || "Error connecting with the server",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Network error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      {/* Floating Button + Tooltip (accessible) */}
      {!isChatOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 group"
          style={{ animation: "bounce 2s infinite" }}
        >
          <button
            onClick={toggleChat}
            type="button"
            aria-label="Open chat"
            aria-describedby="chat-launcher-tooltip"
            className="p-4 bg-gradient-to-r from-gray-950 to-black text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-lg border border-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600"
          >
            <MessageCircle className="h-6 w-6" />
          </button>

          {/* Tooltip */}
          <div
            id="chat-launcher-tooltip"
            role="tooltip"
            className="
              pointer-events-none absolute right-0 -top-2 -translate-y-full
              whitespace-nowrap rounded-md border border-gray-700 bg-gray-900/95 text-gray-200
              px-3 py-1 text-xs shadow-lg
              opacity-0 scale-95 transition
              group-hover:opacity-100 group-hover:scale-100
              group-focus-within:opacity-100 group-focus-within:scale-100
            "
          >
            Message
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className={`
      z-50 bg-black shadow-2xl rounded-2xl border border-gray-800 
      flex flex-col overflow-hidden backdrop-blur-sm bg-opacity-95
      resize-none sm:resize sm:overflow-auto
      fixed sm:absolute bottom-4 right-4 sm:bottom-6 sm:right-6
      w-[90vw] h-[70vh] sm:w-[24rem] sm:h-[32rem]
    `}
          style={{
            minWidth: "300px",
            minHeight: "300px",
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-black to-gray-900 text-white p-4 rounded-t-2xl border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-gray-400" />
              <span className="font-semibold text-gray-200">
                SadBot Assistant
              </span>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-3 overflow-y-auto bg-black scroll-smooth no-scrollbar"
          >
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-10 w-10 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">
                  Hello! I'm here to help you feel better. How are you doing
                  today?
                </p>
              </div>
            )}

            <div className="space-y-4">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[90%] ${
                      msg.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.sender === "user"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-900 text-gray-300"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`flex flex-col ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm sm:text-sm  ${
                          msg.sender === "user"
                            ? "bg-gray-800 text-white rounded-br-md border border-gray-700"
                            : "bg-gray-900 text-gray-200 rounded-bl-md border border-gray-700"
                        }`}
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-xs text-gray-600 mt-1 px-2">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[90%]">
                    <div className="w-8 h-8 rounded-full bg-gray-900 text-gray-300 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-900 rounded-2xl border border-gray-700 px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} className="h-0" />
          </div>

          {/* Input */}
          <div className="p-3 bg-black border-t border-gray-800">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 sm:p-3 rounded-xl bg-gray-900 text-gray-200 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  message.trim() && !isLoading
                    ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                    : "bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800"
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="hidden sm:flex justify-end pr-3 pb-1 text-xs text-gray-500 select-none">
            ⤡ Drag to resize
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
