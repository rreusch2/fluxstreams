from api import app

# This file will be automatically recognized by Vercel as the entry point
# for the serverless function due to being named index.py
handler = app.wsgi_app 