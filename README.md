# Bug-tracker-Assignment
Built a Bug Tracker Project that contains Login form page where there are two demo accounts which are Sign in as developer and Sign in as Manager. In Manager dashboard, developer can add a bug with features and pass to the manager, and in Manager Dashboard, Manager can look at the Bug and after fixing the bugs, He can delete a bug.


A full-stack bug and task management application built using React.js. and Tailwind CSS. The system supports role-based dashboards for Developers and Managers, enabling the tracking, creation, and verification of software bugs/tasks along with time tracking and status updates.

---

## Features

--> Authentication
- Mock login using hardcoded credentials
- Role-based dashboard access (Developer / Manager)

--> Developer Dashboard
- Create, edit, delete bugs/tasks
- Assign priority, assignee, status, due dates
- Track time spent on each task
- Close bugs (pending manager approval)
- Sort/filter bugs by status, priority, etc.
- Trendline graph showing daily task activity

--> Manager Dashboard
- View all bugs/tasks (open, closed, pending)
- Approve or re-open closed bugs
- Monitor time spent by each developer

--> Analytics
- Line chart showing task activity over time
- Total time spent per task

--> UI/UX
- Clean and responsive interface
- Mobile-friendly layout

-----

###  Tech Stack

--> Frontend: Next.js 14, React 18+
--> State Management: Zustand / Redux (your choice)
--> Styling: Tailwind CSS / CSS Modules / styled-components
--> Charts: Recharts / Chart.js
--> Mock Data: Local JSON or static objects
--> Hosting: Vercel / Netlify (for demo)
