"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";

interface Message {
  _id: string;
  userId: string;
  message: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function ChatBox({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  async function fetchMessages(silent = false) {
    try {
      if (!silent) setLoading(true);
      const response = await fetch(
        `/api/messages/get?userId=${encodeURIComponent(userId)}`,
        { cache: "no-store" },
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (!silent) setError(data.error || "Unable to load messages.");
        return;
      }

      setMessages(data.messages || []);
      setError("");
    } catch {
      if (!silent) setError("Unable to connect to support.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) return;

    fetchMessages();
    const interval = window.setInterval(() => fetchMessages(true), 5000);
    return () => window.clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    try {
      setSending(true);
      setError("");
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: text }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to send message.");
        return;
      }

      setInput("");
      await fetchMessages(true);
    } catch {
      setError("Unable to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[min(70vh,520px)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-black text-slate-950">Customer support</h2>
        <p className="mt-1 text-xs text-slate-500">We typically reply inside this chat.</p>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto bg-slate-50/70 p-4"
        aria-live="polite"
      >
        {loading ? (
          <div className="grid flex-1 place-items-center text-slate-400">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : messages.length ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${
                message.role === "user"
                  ? "ml-auto rounded-br-md bg-slate-950 text-white"
                  : "mr-auto rounded-bl-md border border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p>{message.message}</p>
              <time
                className={`mt-1 block text-[10px] ${
                  message.role === "user" ? "text-white/60" : "text-slate-400"
                }`}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          ))
        ) : (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-sm font-black text-slate-800">Start a conversation</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Ask about products, orders or checkout.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
          {error}
        </p>
      )}

      <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 bg-white p-3">
        <label className="sr-only" htmlFor="support-message">
          Message
        </label>
        <input
          id="support-message"
          className="form-input min-w-0 flex-1"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={2000}
          placeholder="Type a message…"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white transition hover:bg-indigo-600 disabled:opacity-50"
          aria-label="Send message"
        >
          {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
        </button>
      </form>
    </div>
  );
}
