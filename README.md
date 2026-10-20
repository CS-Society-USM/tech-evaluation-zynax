# Technical Evaluation Zynax
Fork this repository, make any changes and submit a pull request. Simple.
## NotaKita

A responsive note-taking web app built for the Zynax technical evaluation.

### Features
- Public landing page
- Email sign-up and login
- Create, view, edit, and delete notes
- Row Level Security keeps each user's notes private
- Responsive layout for desktop and mobile

### Technology
- HTML, CSS, and JavaScript
- Supabase Auth
- Supabase PostgreSQL

### Run locally
1. Open this repository in VS Code.
2. Install the Live Server extension.
3. Add the Supabase Project URL and Publishable key to `supabase.js`.
4. Open `index.html` with Live Server.

### Database
The app uses a `public.notes` table with `user_id`, `title`, `content`, and `created_at` fields. Row Level Security policies restrict each user to their own notes.

### Security
The frontend uses a Supabase Publishable key. Never put a Supabase Secret key or `service_role` key in this repository.