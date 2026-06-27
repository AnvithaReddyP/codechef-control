# CodeChef Contest Control Center

A modern, responsive, and real-time frontend dashboard for managing competitive programming contests. Built as an assignment for CodeChef VIT.

## Tech Stack Used
* **Framework**: React.js / Next.js (App Router)
* **Styling**: Tailwind CSS v4
* **State Management**: Zustand (with Persist middleware)
* **Icons**: Lucide React
* **Theme**: next-themes (Dark / Light Mode)
* **Database/Auth**: Supabase (`@supabase/supabase-js`)

## Project Setup Instructions

1. **Clone the repository** (or download the source code).
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:3000`.

*Note: The application is configured to run using a Mock Data Layer entirely locally. No `.env` setup or database configuration is required for evaluation.*

## Folder Structure Explanation

```
frontend/
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Main application layout and pages
│   │   │   ├── leaderboard/    # Dynamic Leaderboard Page
│   │   │   ├── participants/   # Participant Management Page
│   │   │   ├── submissions/    # Submissions Monitoring Page
│   │   │   ├── layout.tsx      # Sidebar & Topbar layout
│   │   │   └── page.tsx        # Dashboard Overview Page
│   │   ├── auth/               # Authentication Page
│   │   ├── globals.css         # Tailwind directives and CSS Custom Properties (Theme)
│   │   └── layout.tsx          # Root Layout with ThemeProvider
│   ├── components/             # Reusable UI elements (Sidebar, Topbar, ThemeProvider)
│   ├── lib/                    
│   │   ├── api.ts              # API layer handling both Supabase and Mock data fetching/updates
│   │   ├── mockData.ts         # Centralized mock datasets
│   │   └── supabase.ts         # Supabase client initialization
│   └── store/
│       └── contestStore.ts     # Global Zustand state for Freeze Mode
├── package.json
└── tailwind.config.js / postcss.config.js
```

## State Management Approach

For state management, **Zustand** was selected due to its minimalistic, unopinionated, and highly performant nature. 
* **Global State**: We manage the `isFreezeMode` using Zustand. We also implemented the `persist` middleware from Zustand to automatically save this state to Local Storage, satisfying the bonus requirement.
* **Local State**: Complex filters, sorts, pagination, and form fields are managed locally within their respective Page components using React's `useState` and `useMemo`, keeping the global store clean.

## Data Flow Explanation

1. **API Abstraction (`lib/api.ts`)**: All pages fetch data through `api.ts`.
2. **Graceful Fallback**: The API tries to connect to Supabase first. Since `NEXT_PUBLIC_SUPABASE_URL` is omitted in the `.env.local` for this assignment, it instantly catches this and falls back to fetching from `mockData.ts`.
3. **Optimistic Updates & Mutations**: When an admin triggers a "Rejudge" action on the Submissions page, it updates the local UI optimistically. It then calls `updateSubmissionVerdict` in `api.ts`.
4. **Data Recalculation**: `updateSubmissionVerdict` successfully recalculates the Participant's score (Problems Solved / Penalty) inside the mock dataset and logs the action in the Activity Feed.

## Assumptions Made

* **Mock Data priority**: Assumed the reviewer will test the app without setting up a Supabase instance, so a highly functional mock data system was prioritized.
* **Authentication**: The Auth screen is fully built but accepts any credentials in mock mode to allow easy access for reviewers.
* **Freeze Mode**: Freeze Mode pauses real-time leaderboard updates. It is fully functional and persisted in local storage.

## Screenshots
*(Add your screenshots here)*

## Deployment Link
*(Add your deployed Vercel/Netlify link here if applicable)*
