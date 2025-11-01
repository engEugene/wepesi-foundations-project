## Wepesi-Foundations-Project

### A Flask backend for the Foundations Project (Volunteer Platform).

This shows how to set up and run the Flask application locally after cloning the repository.

### Prerequisites

- Python 3.8 or newer. Verify with:

```bash
python3 --version
```

- Git


### Quick start

1. Clone the repository into the directory you want the code to be locally and cd to the backend folder:

```bash
git clone https://github.com/engEugene/wepesi-foundations-project .
cd backend
```

2. Create and activate a virtual environment (recommended):

On Linux / macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

On Windows (PowerShell):

```bash
python3 -m venv .venv
source .venv\Scripts\activate
```

3. Install Python dependencies:

```bash
pip3 install -r requirements.txt
```

4. Run database migrations
```bash
flask db upgrade
```

5. Run the application in development mode:

```bash
python3 manage.py
```
or
```bash
#set environment to run in debug mode
export FLASK_ENV=development 
export FLASK_DEBUG=1

flask run
```

Visit the server at http://127.0.0.1:5000

### Project layout

Top-level files and directories:

- `manage.py` — development entrypoint / Flask CLI helper (project runner)
- `wsgi.py` — WSGI entrypoint used by production servers
- `readme.md` — this file
- `requirements.txt` — pinned Python dependencies
- `instance/` — instance-specific configuration (kept out of VCS)
- `migrations/` — Alembic migration scripts (database schema history)
- `tests/` — unit and functional tests
- `app/` — main application package

Inside `app/` (key files and folders):

- `app/app.py` — creates and configures the Flask application, registers blueprints
- `app/__init__.py` — package initialization
- `app/config/` — configuration and database setup
	- `settings.py` — configuration settings
	- `database.py` — database connection/setup helpers
- `app/models/` — SQLAlchemy models (users, events, organizations, badges, participations, etc.)
- `app/routes/` — route / blueprint modules (for example `auth.py`)

Migration scripts live under `migrations/versions/` and are managed with Alembic.

Adjust paths above if you are running the code from a different working directory.

### Environment variables

Set environment variables before running the app. Common variables:

If you need to store secrets (API keys, DB URIs), prefer using a `.env` file and `python-dotenv` to load them in development.

### Common commands

- Run the app directly with Python (alternative to `flask run`):

```bash
python3 app.py
```

- Install a new dependency and update `requirements.txt`:

```bash
pip3 install <package>
pip3 freeze > requirements.txt
```

### Testing

There are no automated tests included yet. To add tests, create a `tests/` directory and use `pytest`.
