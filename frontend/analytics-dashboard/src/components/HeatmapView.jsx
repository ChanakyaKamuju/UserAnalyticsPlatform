import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const HeatmapView = () => {
  const [url, setUrl] = useState("");
  const [clicks, setClicks] = useState([]);

  const fetchHeatmap = async () => {
    if (!url) return;
    const res = await axios.get(`${API_BASE}/heatmap?url=${url}`);
    setClicks(res.data);
  };

  return (
    <div className="mx-auto w-full sm:max-w-11/12 2xl:max-w-8/12  p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter Page URL (e.g. http://localhost:5500/index.html)"
          className="flex-1 p-2 border rounded text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={fetchHeatmap}
          className="bg-cyan-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-cyan-800"
        >
          Generate Heatmap
        </button>
      </div>

      {/* The Visual Canvas */}
      <div className="relative w-full aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
          Page Preview Area
        </div>

        {clicks.map((click, index) => {
          // Normalization Logic:
          // To keep dots accurate, we calculate percentage positions
          const left = (click.x / click.windowWidth) * 100;
          const top = (click.y / (click.windowHeight || 1000)) * 100;

          return (
            <div
              key={index}
              className="absolute w-3 h-3 bg-red-500 rounded-full opacity-60 blur-[1px]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={`Click at ${click.x}, ${click.y}`}
            />
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Displaying {clicks.length} interactions for this page.
      </p>
    </div>
  );
};

export default HeatmapView;
