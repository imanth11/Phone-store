"use client";

import { MessageCircle, X } from "lucide-react";
import UserChatWrapper from "@/app/components/UserChatWrapper";
import { useGlobalContext } from "@/app/context/GlobalProvider";

export default function ChatWidget() {
  const { chatOpen, setchatOpen } = useGlobalContext();

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {chatOpen ? (
        <div className="relative">
          <UserChatWrapper />
          <button
            type="button"
            onClick={() => setchatOpen(false)}
            className="absolute -right-2 -top-2 grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg hover:bg-slate-50"
            aria-label="Close support chat"
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setchatOpen(true)}
          className="grid size-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          aria-label="Open support chat"
        >
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}
