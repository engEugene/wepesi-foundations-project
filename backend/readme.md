### Wepesi-Foundations-Project

## A Flask backend for the Foundations Project (Volunteer Platform).

This shows how to set up and run the Flask application locally after cloning the repository.

## Prerequisites

- Python 3.8 or newer. Verify with:

```bash
python3 --version
```

- Git


## Quick start

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
python3 app.py
```

Visit the server at http://127.0.0.1:5000

## Project layout

- `app.py` — application entrypoint (creates Flask app and registers routes)
- `models` — data models and helpers
- `requirements.txt` — Python dependencies
- `migrations` - Contains database migration files. These files are used to manage changes to the database schema

Adjust paths above if your files are located elsewhere.

## Environment variables

Set environment variables before running the app. Common variables:

If you need to store secrets (API keys, DB URIs), prefer using a `.env` file and `python-dotenv` to load them in development.

## Common commands

- Run the app directly with Python (alternative to `flask run`):

```bash
python3 app.py
```

- Install a new dependency and update `requirements.txt`:

```bash
pip3 install <package>
pip3 freeze > requirements.txt
```

## Testing

There are no automated tests included yet. To add tests, create a `tests/` directory and use `pytest`.

