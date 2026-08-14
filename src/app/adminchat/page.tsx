"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

interface Message {
  _id: string;
  name: string;
  email: string;
  userId: string;
  message: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function AdminChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  async function loadMessages(silent = false) {
    try {
      if (!silent) setLoading(true);
      const response = await fetch("/api/messages/get-all", { cache: "no-store" });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setForbidden(true);
        return;
      }

      if (!response.ok || !data.success) {
        if (!silent) setError(data.error || "Unable to load conversations.");
        return;
      }

      setMessages(data.messages || []);
      setError("");
    } catch {
      if (!silent) setError("Unable to load conversations.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = window.setInterval(() => loadMessages(true), 5000);
    return () => window.clearInterval(interval);
  }, []);

  const conversations = useMemo(() => {
    const map = new Map<string, Message[]>();
    for (const message of messages) {
      const list = map.get(message.userId) || [];
      list.push(message);
      map.set(message.userId, list);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const aDate = new Date(a[1].at(-1)?.createdAt || 0).getTime();
      const bDate = new Date(b[1].at(-1)?.createdAt || 0).getTime();
      return bDate - aDate;
    });
  }, [messages]);

  useEffect(() => {
    if (!selectedUserId && conversations[0]) {
      setSelectedUserId(conversations[0][0]);
    }
  }, [conversations, selectedUserId]);

  const selectedMessages =
    conversations.find(([userId]) => userId === selectedUserId)?.[1] || [];
  const selectedUser = selectedMessages.find((message) => message.role === "user");

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    if (!selectedUserId || !reply.trim()) return;

    try {
      setSending(true);
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          message: reply.trim(),
          role: "admin",
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to send reply.");
        return;
      }

      setReply("");
      await loadMessages(true);
    } catch {
      setError("Unable to send reply.");
    } finally {
      setSending(false);
    }
  }

  if (forbidden) {
    return (
      <section className="container-shell py-20 text-center">
        <h1 className="text-2xl font-black text-slate-950">Admin access required</h1>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white">
          Back to store
        </Link>
      </section>
    );
  }

  return (
    <section className="container-shell py-10 sm:py-14">
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950">
        <ArrowLeft size={16} />
        Orders dashboard
      </Link>
      <p className="section-kicker">Administration</p>
      <h1 className="section-title mt-2">Support inbox</h1>

      {error && (
        <div role="alert" className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid min-h-[580px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-black text-slate-950">Conversations</h2>
            <p className="mt-1 text-xs text-slate-500">{conversations.length} total</p>
          </div>

          {loading ? (
            <div className="grid h-48 place-items-center">
              <Loader2 className="animate-spin text-slate-400" size={22} />
            </div>
          ) : conversations.length ? (
            <div className="max-h-72 overflow-y-auto p-2 lg:max-h-[520px]">
              {conversations.map(([userId, conversation]) => {
                const customer = conversation.find((message) => message.role === "user");
                const last = conversation.at(-1);
                return (
                  <button
                    key={userId}
                    type="button"
                    onClick={() => setSelectedUserId(userId)}
                    className={`w-full rounded-2xl p-3 text-left transition ${
                      selectedUserId === userId
                        ? "bg-slate-950 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <p className="truncate text-sm font-black">{customer?.name || "Customer"}</p>
                    <p className={`mt-1 truncate text-xs ${
                      selectedUserId === userId ? "text-white/60" : "text-slate-400"
                    }`}>
                      {last?.message || "No messages"}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="p-5 text-sm text-slate-500">No conversations yet.</p>
          )}
        </aside>

        <div className="flex min-h-[440px] flex-col">
          {selectedUserId ? (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-black text-slate-950">
                  {selectedUser?.name || "Customer"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{selectedUser?.email || selectedUserId}</p>
              </div>

              <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-slate-50/60 p-4 sm:p-5">
                {selectedMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${
                      message.role === "admin"
                        ? "ml-auto rounded-br-md bg-slate-950 text-white"
                        : "mr-auto rounded-bl-md border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <p>{message.message}</p>
                    <time className={`mt-1 block text-[10px] ${
                      message.role === "admin" ? "text-white/60" : "text-slate-400"
                    }`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="flex gap-2 border-t border-slate-100 p-3 sm:p-4">
                <input
                  className="form-input min-w-0 flex-1"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Write a reply…"
                  maxLength={2000}
                  aria-label="Reply message"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white hover:bg-indigo-600 disabled:opacity-50"
                  aria-label="Send reply"
                >
                  {sending ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
                </button>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-slate-500">
              Select a conversation.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
