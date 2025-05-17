# This file is the entry point for Vercel, as defined in vercel.json.
# It imports the Flask 'app' instance from our api package (api/__init__.py).
from api import app

# Ensure 'app' is globally available in this file for Vercel to discover.
# No explicit 'handler = app.wsgi_app' or 'app.run()' needed for Vercel.
# Vercel's @vercel/python runtime will find the 'app' instance. 