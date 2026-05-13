const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

/**
 * @route   POST /api/events
 * @desc    Ingest tracking data
 */

router.post("/events", async (req, res) => {
  try {
    const eventData = req.body;
    const event = new Event(eventData);
    await event.save();
    res.status(202).json({ message: "Event accepted" });
  } catch (error) {
    console.error("Ingestion Error:", error.message);
    res.status(400).json({ error: "Invalid event data" });
  }
});

/**
 * @route GET /api/sessions
 * @desc  Get all uniquesession with stats for Dashboard summaries
 */

router.get("/sessions", async (req, res) => {
  try {
    const summary = await Event.aggregate([
      {
        $group: {
          _id: "$sessionId",
          totalEvents: { $sum: 1 },
          firstSeen: { $min: "$timestamp" },
          lastSeen: { $max: "$timestamp" },
          entryPage: { $first: "$url" },
        },
      },
      {
        $project: {
          totalEvents: 1,
          entryPage: 1,
          firstSeen: 1,
          lastSeen: 1,
          // Convert ms to seconds and round to 0 decimal places
          durationSeconds: {
            $round: [
              { $divide: [{ $subtract: ["$lastSeen", "$firstSeen"] }, 1000] },
              0,
            ],
          },
        },
      },
      { $sort: { lastSeen: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error("Session Fetch Error:", err.message);
    res.status(500).json({ error: "could not fetch sessions" });
  }
});

/**
 * @route GET /api/sessions/:id
 * @desc  Get all events for a specific session
 */

router.get("/sessions/:id", async (req, res) => {
  try {
    const journey = await Event.find({ sessionId: req.params.id }).sort({
      timestamp: 1,
    });
    res.status(200).json(journey);
  } catch (err) {
    res.status(500).json({ error: "could not fetch journey" });
  }
});

/**
 * @route GET /api/heatmap
 * @desc  Get aggregated click data for heatmap visualization
 */
router.get("/heatmap", async (req, res) => {
  const { url } = req.query;
  try {
    if (!url) {
      return res.status(400).json({ error: "url query parameter required" });
    }

    const decodedUrl = decodeURIComponent(url);
    console.log("Heatmap query url:", { url, decodedUrl });

    const clicks = await Event.find(
      {
        eventType: "click",
        $or: [{ url }, { url: decodedUrl }],
      },
      "x y windowWidth windowHeight",
    );

    console.log(`Heatmap clicks for ${url}:`, clicks.length);
    res.status(200).json(clicks);
  } catch (err) {
    res.status(500).json({ error: "could not fetch heatmap" });
  }
});

module.exports = router;
