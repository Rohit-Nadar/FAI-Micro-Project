# AquaSearch: Water Jug Problem AI Solver

An interactive, production-ready educational web application and Artificial Intelligence workbench demonstrating **Greedy Best-First Search (GBFS)** and **Breadth-First Search (BFS)** applied to the classical Water Jug Problem.

Built for college micro-project demonstrations, academic evaluations, and interactive exploration of state-space search trees, informed heuristics, and priority queue operations.

---

## 1. System Architecture

```
+-------------------------------------------------------------+
|                     React.js + Vite (Vercel)                 |
|   - Tailwind CSS + Glassmorphism UI (Dark Navy / Cyan)      |
|   - Lucide React Icons + Framer Motion Liquid Animation     |
|   - Recharts Performance Graphs + Interactive SVG State Map  |
+-------------------------------------------------------------+
                               |
                               | HTTPS REST API (JSON)
                               v
+-------------------------------------------------------------+
|                     FastAPI Backend (Render)                 |
|   - Python 3.12, Pydantic Input Validation                  |
|   - GBFS with Deterministic Heapq Tie-Breaking              |
|   - BFS Optimal Ground Truth & Misleading Heuristic Engine  |
|   - Bézout's Identity & Mathematical Feasibility Check      |
+-------------------------------------------------------------+
                               |
                               | SQLAlchemy ORM (SSL Mode)
                               v
+-------------------------------------------------------------+
|                  Neon Serverless PostgreSQL                  |
|   - Simulations & Step-by-Step Transition History           |
|   - Non-blocking Graceful Fallback to Local SQLite          |
+-------------------------------------------------------------+
```

---

## 2. Artificial Intelligence Formulation

### A. State Space Representation
Each state is represented as an immutable tuple $(x, y)$ where:
- $x \in [0, C_A]$ is the current volume of water in Jug A (capacity $C_A$).
- $y \in [0, C_B]$ is the current volume of water in Jug B (capacity $C_B$).

### B. Initial & Goal State
- **Initial State:** $(x_0, y_0)$ (default: $(0, 0)$).
- **Goal Condition:** Either Jug A or Jug B contains exactly the target quantity $T$:
  $$\text{Goal}(x, y) \iff x = T \lor y = T$$
  *(Note: Both jugs are NOT required to contain the target quantity).*

### C. Six Legal Production Rules (Operators)
1. **Fill Jug A:** $(x, y) \to (C_A, y)$ if $x < C_A$
2. **Fill Jug B:** $(x, y) \to (x, C_B)$ if $y < C_B$
3. **Empty Jug A:** $(x, y) \to (0, y)$ if $x > 0$
4. **Empty Jug B:** $(x, y) \to (x, 0)$ if $y > 0$
5. **Pour A into B:** $(x, y) \to (x - d, y + d)$ where $d = \min(x, C_B - y)$
6. **Pour B into A:** $(x, y) \to (x + d, y - d)$ where $d = \min(y, C_A - x)$

### D. Student-Designed Heuristic Function
$$h(x, y) = \min(|T - x|, |T - y|)$$
- **Physical Meaning:** Estimates the minimal volume of water that must change in either container to reach the target $T$.
- $h(x, y) = 0 \iff$ Goal State reached.

### E. Mathematical Feasibility: Bézout's Lemma
A target $T > 0$ can be measured if and only if:
1. $T \le \max(C_A, C_B)$
2. $T \pmod{\gcd(C_A, C_B)} = 0$

If $T$ is not a multiple of $\gcd(C_A, C_B)$, the backend immediately returns a mathematical explanation without wasting search cycles. Target $T = 0$ is trivially achievable in 0 operations.

---

## 3. Heuristic Misleading Demonstration (Academic Requirement)

Greedy Best-First Search prioritizes states using only $f(n) = h(n)$, completely ignoring accumulated path cost $g(n)$. Consequently, GBFS is frequently seduced by states with low heuristic values that lead into dead ends or long detours.

### Proven Benchmark Comparison:
| Parameter | Greedy Best-First Search (GBFS) | Breadth-First Search (BFS) | Analysis |
| :--- | :---: | :---: | :--- |
| **Jug A = 4L, Jug B = 7L, Target = 5L** | **12 operations** (18 expanded) | **8 operations** (15 expanded) | **GBFS takes 4 extra operations (+50% detour!)** |
| **Jug A = 4L, Jug B = 9L, Target = 6L** | **16 operations** (22 expanded) | **8 operations** (16 expanded) | **GBFS path is twice as long!** |
| **Jug A = 3L, Jug B = 7L, Target = 5L** | **10 operations** (16 expanded) | **8 operations** (15 expanded) | **GBFS takes suboptimal detour** |
| **Jug A = 4L, Jug B = 3L, Target = 2L** | **4 operations** (6 expanded) | **4 operations** (8 expanded) | Optimal matching case |

---

## 4. Folder Structure

```
d:\FAI Micro Project/
├── backend/
│   ├── app/
│   │   ├── algorithms/
│   │   │   ├── __init__.py
│   │   │   ├── heuristic.py           # h(x, y) calculation
│   │   │   ├── operators.py           # 6 legal production rules
│   │   │   ├── greedy_best_first.py   # GBFS with tie-breaking & snapshots
│   │   │   └── breadth_first_search.py# Optimal BFS ground truth
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── simulation.py          # /search, /simulate, /compare
│   │   │   └── history.py             # /history, /history/{id}
│   │   ├── database.py                # Neon PostgreSQL + SQLite fallback
│   │   ├── models.py                  # SQLAlchemy Simulation & Step models
│   │   ├── schemas.py                 # Pydantic request/response schemas
│   │   ├── crud.py                    # History database operations
│   │   └── main.py                    # FastAPI root application & CORS
│   ├── requirements.txt               # Backend dependencies
│   ├── render.yaml                    # Render deployment configuration
│   ├── .env.example                   # Environment variable template
│   ├── test_algorithms.py             # Automated unit tests
│   └── test_api.py                    # API integration tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Navigation & Neon DB status pill
│   │   │   ├── Hero.jsx               # High-impact educational banner
│   │   │   ├── TheorySection.jsx      # Comprehensive AI curriculum notes
│   │   │   ├── WaterJug.jsx           # Animated water containers & wave physics
│   │   │   ├── SimulationDashboard.jsx# Input controls & playback buttons
│   │   │   ├── PriorityQueue.jsx      # Live min-heap state inspection
│   │   │   ├── StateSpaceGraph.jsx    # Real-time state-space SVG search map
│   │   │   ├── ExecutionLog.jsx       # Step-by-step transition log
│   │   │   ├── ResultsDashboard.jsx   # Recharts metrics visualization
│   │   │   ├── HeuristicComparison.jsx# Academic misleading heuristic demo
│   │   │   ├── HistoryModal.jsx       # Neon database history manager
│   │   │   └── Footer.jsx             # Academic credits & badges
│   │   ├── hooks/
│   │   │   └── useSimulation.js       # Playback timer & API coordination
│   │   ├── services/
│   │   │   └── api.js                 # REST client for FastAPI endpoints
│   │   ├── App.jsx                    # Root application component
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Tailwind styles & glassmorphism
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite bundler & API proxy configuration
│   ├── tailwind.config.js             # Tailwind CSS dark navy palette
│   ├── vercel.json                    # Vercel SPA routing configuration
│   └── .env.example                   # Vercel environment variable template
│
└── README.md
```

---

## 5. Local Setup & Execution Guide

### Prerequisites
- Python 3.10+ (Installed at `C:\Users\nadar\AppData\Local\Programs\Python\Python312`)
- Node.js 18+ (Installed at `C:\Users\nadar\AppData\Local\Programs\nodejs`)

### Step 1: Start Backend (FastAPI)
```bash
# In terminal 1:
cd "d:\FAI Micro Project\backend"

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### Step 2: Start Frontend (React + Vite)
```bash
# In terminal 2:
cd "d:\FAI Micro Project\frontend"

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 6. Cloud Deployment Instructions

### A. Database (Neon Serverless PostgreSQL)
1. Sign up / Log in to [Neon.tech](https://neon.tech).
2. Create a new PostgreSQL database project (e.g. `waterjug-db`).
3. Copy your connection string from the Neon dashboard. It looks like:
   ```
   postgresql://neondb_owner:password@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### B. Backend (Render)
1. Push this repository to your GitHub account.
2. Sign in to [Render.com](https://render.com) and click **New > Web Service**.
3. Connect your repository.
4. Set the following settings:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: *(Your Neon PostgreSQL connection string)*
   - `CORS_ORIGINS`: `https://*.vercel.app,http://localhost:5173`
   - `PYTHON_VERSION`: `3.12.0`
6. Click **Deploy Web Service**. Once deployed, copy your Render URL (e.g. `https://water-jug-api.onrender.com`).

### C. Frontend (Vercel)
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New > Project**.
2. Select your repository.
3. Set the following configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: *(Your Render backend URL, e.g. `https://water-jug-api.onrender.com`)*
5. Click **Deploy**. Vercel will build and deploy your site with global CDN distribution!

---

## 7. Verification Test Suite Results

All tests have been executed and verified directly against the production algorithms:
- `Test 1 (4L, 3L -> 2L)`: Passed (GBFS = 4 operations, BFS = 4 operations).
- `Test 2 (5L, 3L -> 4L)`: Passed (GBFS = 6 operations, BFS = 6 operations).
- `Test 3 (3L, 5L -> 4L)`: Passed (GBFS = 6 operations, BFS = 6 operations).
- `Test 4 (2L, 4L -> 3L)`: Passed (Mathematically caught: GCD(2,4)=2 does not divide 3).
- `Test 5 (4L, 3L -> 0L)`: Passed (0 operations, target immediately met).
- `Negative inputs & Capacity overflow`: Caught cleanly with informative error messages.
- `Misleading Heuristic Cases (4L, 7L -> 5L)`: Verified (GBFS 12 ops vs BFS 8 ops).
