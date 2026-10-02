import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { TrashIcon, CheckIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { api } from "../../services/api.js";

const STATUS_COLORS = { UNREAD: "bg-primary-500", READ: "bg-gray-400", ARCHIVED: "bg-gray-200" };
const TABS = ["ALL","UNREAD","READ","ARCHIVED"];

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");

  const load = (tab) => {
    const query = tab === "ALL" ? "" : `?status=${tab}`;
    api.get(`/messages${query}`).then(r => setMessages(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(activeTab); }, [activeTab]);

  const update = async (id, status) => {
    await api.put(`/messages/${id}`, { status });
    load(activeTab);
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };
  const del = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api.delete(`/messages/${id}`);
    setSelected(null);
    load(activeTab);
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>;

  return (
    <>
      <Helmet><title>Messages — CodeFolio Dashboard</title></Helmet>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500 mt-1">Contact messages from your portfolio visitors</p>
        </div>

        <div className="flex gap-2 mb-6">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-6 max-h-[600px]">
          {/* List */}
          <div className="w-80 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
            {messages.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="text-3xl mb-3">📭</p>
                <h3 className="font-bold mb-1">No messages</h3>
                <p className="text-gray-500 text-sm">Messages from your portfolio will appear here.</p>
              </div>
            ) : messages.map(m => (
              <div key={m.id} onClick={() => { setSelected(m); if (m.status === "UNREAD") update(m.id, "READ"); }}
                className={`card p-4 cursor-pointer hover:border-primary-300 transition-colors ${selected?.id === m.id ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[m.status]}`} />
                  <span className="font-semibold text-sm truncate flex-1">{m.senderName}</span>
                  <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{m.subject || "No subject"}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{m.message}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 min-w-0">
            {selected ? (
              <div className="card p-6 h-full overflow-y-auto">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{selected.subject || "No subject"}</h2>
                    <p className="text-sm text-gray-500">From: <span className="font-medium">{selected.senderName}</span> &lt;{selected.senderEmail}&gt;</p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(selected.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => update(selected.id, "ARCHIVED")} title="Archive"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                      <ArchiveBoxIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => update(selected.id, "READ")} title="Mark read"
                      className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500">
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => del(selected.id)} title="Delete"
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a href={`mailto:${selected.senderEmail}?subject=Re: ${selected.subject || ""}`}
                    className="btn-primary text-sm inline-flex items-center gap-1.5">
                    Reply via email
                  </a>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center h-full flex flex-col items-center justify-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-gray-500">Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
