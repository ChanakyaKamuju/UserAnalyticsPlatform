import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import UserJourney from "./components/UserJourney";
import HeatmapView from "./components/HeatmapView.js";

function App() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [view, setView] = useState("sessions"); // 'journey' or 'heatmap'
  const sessionsRef = useRef(null);
  const heatmapRef = useRef(null);
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    function updateIndicator() {
      const btn =
        view === "sessions" ? sessionsRef.current : heatmapRef.current;
      const container = containerRef.current;
      if (btn && container) {
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setIndicator({
          left: btnRect.left - containerRect.left,
          width: btnRect.width,
        });
      }
    }

    // measure initially and on resize
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [view]);

  return (
    <div className="flex h-screen bg-gray-200">
      <main className="flex-1 flex flex-col">
        {/* Centered pill-shaped navbar with adaptive sliding indicator */}
        <div className="flex justify-center p-6 ">
          <div
            ref={containerRef}
            className="relative inline-flex items-center rounded-full bg-white shadow-md pt-1 pb-1"
          >
            <span
              className="pointer-events-none absolute top-0 h-full bg-cyan-700 rounded-full"
              style={{
                left: indicator.left,
                width: indicator.width,
                transition: "left 300ms, width 300ms",
                willChange: "left, width",
              }}
              aria-hidden="true"
            />
            <button
              ref={sessionsRef}
              onClick={() => setView("sessions")}
              className={`relative px-6 py-2 rounded-full transition-colors duration-150 font-medium z-10 ${
                view === "sessions"
                  ? "text-white"
                  : "text-cyan-700 hover:bg-gray-300 hover:cursor-pointer"
              }`}
            >
              Sessions
            </button>
            <button
              ref={heatmapRef}
              onClick={() => setView("heatmap")}
              className={`relative px-6 py-2 rounded-full transition-colors duration-150 font-medium z-10 ${
                view === "heatmap"
                  ? "text-white"
                  : "text-cyan-700 hover:bg-gray-300 hover:cursor-pointer"
              }`}
            >
              Heatmap Analysis
            </button>
          </div>
        </div>

        <div className="pl-8 pr-8 pb-8 flex-1 overflow-hidden">
          {view === "sessions" ? (
            <div className="flex flex-col md:flex-row w-full h-full rounded-3xl overflow-hidden shadow-lg">
              <div className="w-full md:w-auto h-1/2 md:h-full">
                <Sidebar onSelectSession={setSelectedSession} />
              </div>

              <div className="flex-1 h-1/2 md:h-full bg-white overflow-auto">
                <UserJourney sessionId={selectedSession} />
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto flex items-center justify-center">
              <HeatmapView />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
