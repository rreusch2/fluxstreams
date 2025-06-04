from flask import request, jsonify
from flask_cors import CORS # For Cross-Origin Resource Sharing
from flask_limiter import Limiter # For rate limiting
from flask_limiter.util import get_remote_address # For rate limiting
from api import app, limiter  # Import app and limiter from __init__.py
from api.utils.grok import call_grok_api, extract_assistant_response  # Updated import
from api.utils.n8n_handler import send_chat_lead_to_n8n # Import the new function
# We will ignore the n8n import and related functions for now
# from api.utils.n8n import send_lead_to_n8n, validate_lead_data 
import json
import logging # Added for logging
import html # For input sanitization
import re # For parsing lead details

# Placeholder functions are now removed as we will use the actual utilities

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# TODO: Configure CORS more restrictively for production
# For now, allowing all origins for development ease.
CORS(app) 

# TODO: Configure rate limits appropriately for production.
# This is a basic example.
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour", "5 per minute"],
    storage_uri="memory://",  # Use redis in production
)

# Helper function to validate conversation history
def is_valid_conversation_history(history):
    if not isinstance(history, list):
        return False
    for item in history:
        if not isinstance(item, dict) or \
           'role' not in item or not isinstance(item['role'], str) or \
           'content' not in item or not isinstance(item['content'], str):
            return False
    return True

def parse_lead_details(text: str) -> dict:
    """Parses lead details from a string based on the [LEAD_INFO_COLLECTED] marker."""
    details = {}
    # Regex to find Key: Value pairs after the marker, allowing for multi-line messages
    # It captures "Key" and "Value", where Value can span until the next Key or end of string.
    # Using re.DOTALL so . matches newlines for the Message part.
    match = re.search(r"FirstName: (.*?)(?:, Email: (.*?))?(?:, Message: (.*?))? Thanks,", text, re.DOTALL)
    if match:
        details["FirstName"] = match.group(1).strip() if match.group(1) else ""
        details["Email"] = match.group(2).strip() if match.group(2) else ""
        # The message is everything from its start to before " Thanks,"
        # We need to be careful if Email is not present.
        # A simpler approach for the message if the AI sticks to the format:
        # Find "Message: " and take everything until " Thanks,"
        message_match = re.search(r"Message: (.*?) Thanks,", text, re.DOTALL)
        if message_match:
            details["Message"] = message_match.group(1).strip()
        else: # Fallback if Message part is tricky, or only FirstName/Email captured
            details["Message"] = ""

        # Ensure keys exist even if empty, matching n8n_handler expectations
        if "FirstName" not in details: details["FirstName"] = ""
        if "Email" not in details: details["Email"] = ""
        if "Message" not in details: details["Message"] = "See conversation for details"

    logger.info(f"Parsed lead details: {details}")
    return details

@app.route('/api/chatbot', methods=['POST'])
@limiter.limit("5 per minute")  # Rate limiting to prevent abuse
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "No message provided"}), 400
            
        user_message = data.get('message', '').strip()
        conversation_history = data.get('conversation_history', [])
        
        # Validate conversation history
        if not is_valid_conversation_history(conversation_history):
            return jsonify({"error": "Invalid conversation history format"}), 400
            
        # Call Grok API
        response = call_grok_api(user_message, conversation_history)
        
        # Extract and process the response
        assistant_response = extract_assistant_response(response)
        
        # Check for lead collection marker and handle accordingly
        if '[LEAD_INFO_COLLECTED]' in assistant_response:
            try:
                # Extract lead information
                lead_info = re.search(r'\[LEAD_INFO_COLLECTED\](.*?)(?=\n|$)', assistant_response)
                if lead_info:
                    # Remove the marker from the response
                    assistant_response = assistant_response.replace(lead_info.group(0), '').strip()
                    # Send lead to n8n
                    send_chat_lead_to_n8n(lead_info.group(1))
            except Exception as e:
                logger.error(f"Error processing lead information: {e}")
                # Continue with the response even if lead processing fails
        
        return jsonify({
            "response": assistant_response,
            "conversation_history": conversation_history + [
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": assistant_response}
            ]
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({"error": "An error occurred processing your request"}), 500

@app.route('/api/chatbot/greeting', methods=['GET'])
@limiter.limit("30 per minute") # Apply a slightly more relaxed limit for greetings
def chatbot_greeting():
    """Return the initial greeting message for the chatbot."""
    greeting = "Hey! I'm Otto, the AI assistant for Fluxstream. I can chat about AI, explain our services, or get you in touch with Reid. He's the one who built me – and he can build smart AI like me for your business too! So, what's on your mind?"
    logger.info(f"Sending greeting: {greeting}")
    return jsonify({"greeting": greeting})

# api/__init__.py already imports this module (chatbot)
# Example: from . import chatbot
# This will be handled in a subsequent step. 