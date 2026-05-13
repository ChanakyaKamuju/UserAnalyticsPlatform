import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import UserJourney from "./components/UserJourney";
import HeatmapView from "./components/HeatmapView";

function App() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [view, setView] = useState("sessions"); // 'journey' or 'heatmap'

  return (
    <div className="flex h-screen bg-gray-200">
      <main className="flex-1 flex flex-col">
        {/* Centered pill-shaped navbar */}
        <div className="flex justify-center p-6 ">
          <div className="inline-flex items-center rounded-full bg-white shadow-md p-1">
            <button
              onClick={() => setView("sessions")}
              className={`px-6 py-2 rounded-full transition-colors duration-150 font-medium  ${view === "sessions" ? "bg-cyan-700 text-white" : "text-cyan-700 hover:bg-gray-300 hover:cursor-pointer"}`}
            >
              Sessions
            </button>
            <button
              onClick={() => setView("heatmap")}
              className={`px-6 py-2 rounded-full transition-colors duration-150 font-medium ${view === "heatmap" ? "bg-cyan-700 text-white" : "text-cyan-700 hover:bg-gray-300 hover:cursor-pointer"}`}
            >
              Heatmap Analysis
            </button>
          </div>
        </div>

        <div className="pl-8 pr-8 pb-8 flex-1 overflow-hidden">
          {view === "sessions" ? (
            <div className="flex w-full h-full rounded-3xl overflow-hidden shadow-lg">
              <Sidebar onSelectSession={setSelectedSession} />

              <div className="flex-1 h-full bg-white overflow-auto">
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
