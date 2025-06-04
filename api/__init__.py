from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app)

# Configure rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour", "5 per minute"],
    storage_uri="memory://"
)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify(status="healthy", message="API is running correctly"), 200

# This is important for Vercel to pick up the app
# It should match the entrypoint in vercel.json if that's how it's configured,
# or Vercel will look for an 'app' instance in a file matching the path.
# For a structure like api/__init__.py, 'app' should be exposed directly.
# If chatbot.py were the entry, it might be from api.chatbot import app

# If you have other routes in other files (like chatbot.py),
# they would be imported and registered here or via Blueprints.
# For example:
# from . import chatbot # Assuming chatbot.py defines routes on a Blueprint or directly on 'app' if imported 
from . import chatbot  # This will register the chatbot routes

# Handler for Vercel serverless functions
# def handler(request):
#     return app(request) 