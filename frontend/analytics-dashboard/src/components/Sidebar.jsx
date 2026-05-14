import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, List, Globe, Timer } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const Sidebar = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Fetch sessions when the component loads
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/sessions`);
      setSessions(res.data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds === 0) return "0s (Bounced)";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleSelect = (id) => {
    setActiveId(id);
    onSelectSession(id); // Send the ID up to App.jsx
  };

  return (
    <div className=" bg-white flex flex-col shadow-sm z-10 h-full shrink-0 overflow-auto border-b md:border-r border-neutral-200">
      {/* Header */}
      <div className="p-5 h-24 shadow-sm bg-cyan-700 flex justify-between items-center sticky top-0">
        <div>
          <h2 className="text-lg font-bold text-white">Active Sessions</h2>
          <p className="text-xs text-white">Live tracker data </p>
        </div>
        <button
          onClick={fetchSessions}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          title="Refresh Sessions"
        >
          <Clock size={18} className="text-white" />
        </button>
      </div>

      {/* Session List */}
      <div className="overflow-y-auto flex-1">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No sessions tracked yet. Visit your demo page!
          </div>
        ) : (
          sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => handleSelect(s._id)}
              className={`p-4 border-b cursor-pointer transition-all ${
                activeId === s._id
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : "hover:bg-slate-50 border-l-4 border-transparent"
              }`}
            >
              <p
                className="font-mono text-sm font-semibold text-blue-700 truncate"
                title={s._id}
              >
                {s._id}
              </p>
              <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <List size={14} className="text-slate-400" /> {s.totalEvents}{" "}
                  events
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Globe size={14} className="text-slate-400" />
                  {s.entryPage?.split("/").pop() || "index"}
                </span>
                <span className="flex items-center gap-1">
                  <Timer size={14} className="text-slate-400" />
                  {formatDuration(s.durationSeconds)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
