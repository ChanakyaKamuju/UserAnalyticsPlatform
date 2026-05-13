# User Analytics Platform

A full-stack user analytics platform designed to track, aggregate, and visualize user behavior across web applications. Built as a technical evaluation for the Full Stack Engineer role at CausalFunnel.

**Live Application Links:**

- 🖥️ **Frontend Dashboard:** [UserAnalyticsPlatform](https://user-analytics-platform.vercel.app/)
- ⚙️ **Backend API:** [BackendAPI](https://useranalyticsplatform.onrender.com)
- 📦 **Demo Page:** To test tracking, visit the dashboard, open the console/network tab, and click anywhere to generate live events!

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **DevOps & Deployment:** Docker, Docker Compose, Vercel, Render

---

## ✨ Key Features

1. **Lightweight Tracking Script:** A vanilla JavaScript tracker that intercepts `clicks` and `page_views` using `navigator.sendBeacon` for non-blocking data ingestion.
2. **Session Intelligence:** Automatically calculates session duration (Time on Page) directly at the database aggregation layer using MongoDB pipelines.
3. **Chronological User Journeys:** A visual timeline showing the exact sequence of pages visited and elements clicked by individual users.
4. **Dynamic Heatmaps:** A URL-based visual overlay that plots click coordinates using percentage-based normalization, ensuring accuracy across different device screen sizes.

---

## 🚀 Future Scalability Improvements

To transition this MVP into an enterprise-grade tracking system capable of handling Black Friday-level e-commerce traffic, I would implement the following architectural upgrades:

1. **Client-Side Event Batching:** The current tracker sends an HTTP request immediately upon interaction. I would modify this to buffer events in a local array and flush them to the server every 5-10 seconds (or via the `visibilitychange` API upon page exit) to drastically reduce network overhead.
2. **In-Memory Message Queue:** Directly writing high-frequency events to MongoDB can cause write-locking. I would integrate **Redis** and **BullMQ** on the backend. The API would instantly accept the batched payload (`202 Accepted`) and push it to Redis, allowing background worker threads to perform bulk inserts (`insertMany`) into the database.
3. **Device-Specific Heatmap Filtering:** Because website layouts change drastically between mobile and desktop, plotting all clicks on a single canvas skews the visual data. I would introduce a device toggle to filter heatmap data based on viewport breakpoints.

---

## 🏗️ Architecture, Assumptions & Trade-offs

Building a production-ready analytics engine requires balancing data fidelity with system performance. Here are the core decisions made for this MVP:

### 1. The Heatmap: URL-Based vs. Session-Based

- **Decision:** The heatmap visualizer is driven globally by `URL` rather than individual `SessionID`.
- **Trade-off:** While looking at a single user's clicks can be helpful for debugging, heatmaps are fundamentally statistical tools meant to evaluate aggregate UI/UX effectiveness. Tying a heatmap to a single session creates "false heat" (just a few isolated dots) and clutters the UI state.
- **Assumption:** Product managers using this tool care about _where_ the majority of traffic clicks on a specific page, rather than where one specific user clicked.

### 2. Coordinate Normalization

- **Decision:** Click events capture `windowWidth` and `windowHeight`. The dashboard renders dots using CSS percentages `(x / width * 100)`.
- **Trade-off:** This guarantees that the heatmap dots align relatively well regardless of the size of the dashboard viewer's monitor. However, it assumes the underlying website layout is primarily fluid.

### 3. Dynamic Environments & Security (CORS)

- **Decision:** Hardcoding API URLs and CORS origins limits scalability. The frontend utilizes `import.meta.env.VITE_API_BASE` to dynamically switch between local and Vercel environments. Similarly, the backend CORS policy is driven by an `ALLOWED_ORIGINS` environment variable.
- **Trade-off:** Requires slightly more setup for local development (creating `.env` files), but ensures that zero sensitive configuration data is leaked into the public repository and adding new client domains requires no code changes.

---

## 💻 Local Setup & Development

This project is fully containerized for a seamless developer experience, but can also be run manually.

### Option A: Using Docker (Recommended)

1. Clone the repository.
2. Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ```
3. Run the following command from the root directory:
   ````
   docker-compose up --build```
   ````
4. The dashboard will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

# Option B: Manual Setup

## 1. Backend

Navigate to the server folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `/server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5500
```

Run the backend server:

```bash
npm run dev
```

---

## 2. Frontend Dashboard

Navigate to the frontend folder and install dependencies:

```bash
cd analytics-dashboard
npm install
```

Create a `.env` file inside the `/analytics-dashboard` folder:

```env
VITE_API_BASE=http://localhost:5000/api
```

Run the frontend application:

```bash
npm run dev
```
