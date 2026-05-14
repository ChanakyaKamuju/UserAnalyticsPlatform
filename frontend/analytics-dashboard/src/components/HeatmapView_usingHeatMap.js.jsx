import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import h337 from "heatmap.js";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const HeatmapView = () => {
  const [url, setUrl] = useState("");
  const [clicks, setClicks] = useState([]);
  const containerRef = useRef(null);
  const heatmapInstance = useRef(null);

  // Determine dynamic aspect ratio dimensions based on incoming data
  // Falls back to a standard 16:9 desktop canvas ratio if no data is loaded yet
  const baseWidth = clicks.length > 0 ? clicks[0].windowWidth : 1920;
  const baseHeight =
    clicks.length > 0 && clicks[0].windowHeight ? clicks[0].windowHeight : 1080;

  const fetchHeatmap = async () => {
    if (!url) return;
    const res = await axios.get(`${API_BASE}/heatmap?url=${url}`);
    setClicks(res.data);
  };

  // Re-render the thermal heatmap layer whenever click data updates
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Wipe out any stale tracking container layers painted by heatmap.js during previous triggers
    containerRef.current.innerHTML = "";

    // 2. Initialize the wrapper config context targeting our aspect-locked target element
    heatmapInstance.current = h337.create({
      container: containerRef.current,
      radius: 25, // The pixel radius bleed for each thermal hotspot point
      maxOpacity: 0.6, // Absolute maximum glow limit overlay transparency
      minOpacity: 0,
      blur: 0.85, // Dispersion smoothness edge blur factor
    });

    // 3. Catch the real bounding rendering box width/height metrics of the container element in the live viewport
    const rect = containerRef.current.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    // 4. Transform the relative tracking percentages back into real-time absolute local coordinate system pixels
    const points = clicks.map((click) => {
      const leftPercent = click.x / click.windowWidth;
      const topPercent = click.y / (click.windowHeight || baseHeight);

      return {
        x: Math.round(leftPercent * rect.width), // Translate normalized fractional position to current pixel bounding width
        y: Math.round(topPercent * rect.height), // Translate normalized fractional position to current pixel bounding height
        value: 1, // Individual event impact weighting metric
      };
    });

    // 5. Commit payload coordinates directly to native instance runtime store to fire automatic gradient mapping
    heatmapInstance.current.setData({
      max: clicks.length > 5 ? 5 : clicks.length || 1, // Saturation density roof where color spectrum turns deep red
      min: 0,
      data: points,
    });
  }, [clicks, baseHeight]);

  return (
    <div className="mx-auto w-full sm:max-w-11/12 2xl:max-w-8/12 p-6 bg-white rounded-xl shadow-lg flex flex-col h-full min-h-0">
      {/* Control Configuration Bar */}
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
          className="bg-cyan-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-cyan-800 transition-colors shrink-0"
        >
          Generate Thermal Heatmap
        </button>
      </div>

      {/* Elastic Base Viewport Box wrapper to center and frame target canvas safely */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 p-4">
        {/* The Direct Visual Canvas Object instance hooked cleanly to our tracking system wrapper logic */}
        <div
          ref={containerRef}
          className="relative bg-white shadow-md border border-gray-200"
          style={{
            aspectRatio: `${baseWidth} / ${baseHeight}`,
            maxHeight: "100%",
            maxWidth: "100%",
            width: "100%", // Required to trigger standard CSS structural aspect calculations correctly inside flex engines
          }}
        >
          {/* Subtle background context label */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none text-xs z-0 font-mono">
            Target Workspace: {baseWidth}x{baseHeight}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Displaying {clicks.length} normalized real-time interactions for this
        page.
      </p>
    </div>
  );
};

export default HeatmapView;
