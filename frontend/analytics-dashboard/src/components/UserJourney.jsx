import React, { useEffect, useState } from "react";
import axios from "axios";
import { MousePointer2, Globe, ArrowDown } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://useranalyticsplatform.onrender.com/api";

const UserJourney = ({ sessionId }) => {
  const [journey, setJourney] = useState([]);
  const [loading, setLoading] = useState(false);

  // Whenever sessionId changes, fetch the new journey
  useEffect(() => {
    if (!sessionId) return;

    const fetchJourney = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/sessions/${sessionId}`);
        setJourney(res.data);
      } catch (error) {
        console.error("Failed to fetch journey", error);
      }
      setLoading(false);
    };

    fetchJourney();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white text-slate-400 space-y-4">
        <Globe size={48} className="opacity-20" />
        <p className="text-lg font-medium">
          Select a session from the sidebar to view the journey.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse flex space-x-4">
        Loading journey data...
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (seconds === 0) return "0s (Bounced)";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };
  // Calculate duration dynamically from the journey array
  const firstEventTime = new Date(journey[0]?.timestamp).getTime();
  const lastEventTime = new Date(
    journey[journey.length - 1]?.timestamp,
  ).getTime();
  const durationSeconds = Math.round((lastEventTime - firstEventTime) / 1000);

  return (
    <div className="">
      <div className="flex flex-row items-center justify-between mb-8 h-18 md:h-24 sticky w-full top-0 bg-cyan-700 z-10 p-4">
        <div>
          <h2 className="text-lg  md:text-2xl font-bold text-white">
            Event Timeline
          </h2>
          <p className="text-xs md:text-sm text-neutral-300 font-mono mt-1">
            Session: {sessionId}
          </p>
        </div>
        <div className="bg-blue-50 border  border-blue-100 rounded-lg px-1 md:px-2 py-0.5 md:py-1 text-right">
          <p className="text-[10px] md:text-xs text-cyan-600 font-semibold uppercase tracking-wider mb-0.5">
            Total Duration
          </p>
          <p className="text-sm md:text-lg font-bold text-cyan-700">
            {formatDuration(durationSeconds)}
          </p>
        </div>
      </div>

      <div className="max-w-2xl  mx-auto space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {journey.map((event, idx) => (
          <div
            key={idx}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline Icon */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                event.eventType === "click"
                  ? "bg-rose-500 text-white"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {event.eventType === "click" ? (
                <MousePointer2 size={16} />
              ) : (
                <Globe size={16} />
              )}
            </div>

            {/* Event Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow-sm bg-white border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-bold capitalize ${event.eventType === "click" ? "text-rose-600" : "text-emerald-600"}`}
                >
                  {event.eventType.replace("_", " ")}
                </span>
                <time className="text-[10px] font-medium text-slate-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </time>
              </div>
              <p className="text-sm text-slate-600 truncate" title={event.url}>
                {event.url.split("/").pop() || event.url}
              </p>

              {/* Conditional Metadata */}
              {event.eventType === "click" && event.target && (
                <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-500 flex justify-between">
                  <span>
                    Target:{" "}
                    <span className="font-mono bg-slate-100 px-1 rounded">
                      {event.target}
                    </span>
                  </span>
                  <span>
                    [x: {event.x}, y: {event.y}]
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserJourney;
