"use client";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages([...newMessages, { sender: "bot", text: data.reply }]);
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 z-50">
      <h3 className="font-semibold text-fuchsia-700 mb-3 flex items-center gap-2">
        🤖 Product Assistant
      </h3>

      <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-3 text-sm mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`my-1 ${m.sender === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-1 rounded-2xl max-w-[80%] ${
                m.sender === "user"
                  ? "bg-fuchsia-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left text-gray-400 italic animate-pulse">typing...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-3 py-1 text-sm focus:outline-fuchsia-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product..."
        />
        <button
          onClick={sendMessage}
          className="bg-fuchsia-600 text-white rounded-xl px-4 hover:bg-fuchsia-700 transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
