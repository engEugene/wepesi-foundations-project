\# Wepesi Foundations Project



\## Project Overview

This project is a \*\*Student Volunteering Platform aimed at connecting students with volunteering opportunities through an easy-to-use online system.



\## Frontend

\- Built with React + TypeScript + Vite

\- Handles UI rendering, routing, and state management

\- Communicates with backend APIs using Axios

\- Pages include: 

&nbsp; - User onboarding (volunteer/organization)

&nbsp; - Event creation and browsing

&nbsp; - Volunteer history and badges

&nbsp; - Real-time updates on volunteering opportunities



\## Backend

\- Developed using Flask (Python)

\- Exposes RESTful API endpoints for:

&nbsp; - Authentication (JWT)

&nbsp; - Organization onboarding

&nbsp; - Event creation and management

&nbsp; - Volunteer registration and participation tracking

\- Uses SQLAlchemy ORM for database queries

\- Alembic manages schema migrations



\## Database

\- \*\*PostgreSQL\*\* in production, SQLite in development

\- Core tables: `users`, `organizations`, `events`, `participations`, `badges`, `user\_badges`



