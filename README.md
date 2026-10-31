# Smart Library Assistant - Web Application

A modern, responsive digital library management system and AI-powered academic assistant built with React, TypeScript, Tailwind CSS, Express, and Google Gemini API (`gemini-3.8-flash`).

---

## 🌟 Key Features

1. **Catalog Management (My Books)**
   - Clean, responsive catalog view with instant live search across titles, authors, ISBNs, publishers, and shelf locations.
   - Grid and List view modes.
   - Multi-criteria filtering by collection category, availability status (In Library, Low Stock, Checked Out), and sorting (Title A–Z, Year, Recently Added).
   - Real-time stock status pills (`Available`, `1 Copy Left`, `Checked Out`).

2. **Issue and Return Management**
   - Fast book checkout with automated inventory decrement.
   - Guard against checking out unavailable books or exceeding student borrow limits.
   - Automated overdue status tracking with daily fine calculations ($0.50/day).
   - One-click book return updating shelf inventory in real-time.

3. **Smart AI Library Assistant (v2.0)**
   - Powered by Gemini 3.8 Flash (`gemini-3.8-flash`) via secure server-side `/api/assistant` endpoint.
   - Offline / local intelligent librarian reasoning fallback with zero downtime.
   - Speech-to-text / voice query support for hands-free book discovery.
   - Categorized quick prompt chips (*Recommendations*, *Catalog & Shelf*, *Policies & Rules*).
   - Interactive book recommendation cards inside chat with direct "View Details" and "Issue Book" buttons.
   - Floating AI summon button accessible from any page.

4. **Member & Student Management**
   - Comprehensive student registry with departments, contact details, active borrowings, and quotas.
   - Profile inspector showing active checkouts and loan history.
   - Protection against deleting members with active, unreturned books.

5. **Book Collections & Categories**
   - Curated academic disciplines (Computer Science, Programming, Artificial Intelligence, Operating Systems, Networking, Mathematics, Business, etc.).
   - Physical shelf location mappings (e.g., Aisle 2 - Section A).
   - 1-click filter from collections to catalog holdings.

6. **Reports & Analytics**
   - Inventory utilization rate and circulation ratios.
   - Top 5 most frequently borrowed books.
   - Top active student borrowers.
   - One-click CSV exports for Books Catalog, Loan Transactions, and Members Registry.
   - Print-ready report styles.

7. **Storage & Data Portability**
   - Persistent LocalStorage database.
   - Full JSON database backup export and restoration.
   - Reset to standard demo dataset (17 titles, 6 students, realistic loan records).

8. **Role-Based Demo Authentication**
   - Administrator / Librarian role (Dr. Sarah Jenkins).
   - Student Member role (Alex Rivera).
   - Quick one-click role switcher in the header and sidebar.

---

## 🚀 Running the Project in Visual Studio Code

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Steps:
1. Open the project folder in VS Code:
   ```bash
   code .
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (optional for AI features):
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY="your-google-gemini-api-key"
   PORT=3000
   ```
   *(Note: The application includes a smart local librarian reasoning engine that answers catalog questions even if no API key is provided!)*
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## 🌐 Deploying to Free Static / Cloud Hosting

### Option 1: Full-Stack on Cloud Run / Render / Railway
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Start the Express server:
   ```bash
   npm start
   ```

### Option 2: Static Hosting (Vercel, Netlify, GitHub Pages)
1. Run `npm run build` to generate the production bundle inside `dist/`.
2. Connect your repository to Vercel or Netlify.
3. Set the build command to `npm run build` and output directory to `dist`.
4. The client-side application will run with full LocalStorage persistence and smart local catalog AI reasoning.

---

## 🔒 Gemini API Security Configuration
- The Gemini API key is accessed strictly server-side through `process.env.GEMINI_API_KEY` inside `server.ts`.
- The key is **never** bundled into or exposed to client-side JavaScript.
- Client requests query `/api/assistant`, which securely forwards questions with live catalog context to `gemini-3.8-flash`.

---

## Admin login
Only the admin can open the Admin Panel (separate dashboard interface).
- Default admin email: `admin@library.com`
- Default password: `admin123` (change it in Admin Panel → Settings → Admin Login Security)

## Run locally
```
npm install
npm run dev
```
Open http://localhost:3000

## Host on GitHub Pages (no Node needed)
A ready-made single-file build is in `docs/index.html`.
Repository → Settings → Pages → Source: "Deploy from a branch" → Branch `main`, folder `/docs` → Save.

## Student login
Students register with their own password. Demo students (e.g. alex.rivera@college.edu) and students added by the admin use the default password `student123`.

## One sign-in for everyone
There is a single Sign in form. Admin email + password opens the Admin Panel; a student's email + password opens the student website.
