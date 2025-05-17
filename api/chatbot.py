from flask import request, jsonify
from flask_cors import CORS # For Cross-Origin Resource Sharing
from flask_limiter import Limiter # For rate limiting
from flask_limiter.util import get_remote_address # For rate limiting
from api import app
from api.utils.deepseek import call_deepseek_api, extract_assistant_response # Corrected import
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
@limiter.limit("10 per minute") # Apply rate limit to this endpoint
def chatbot():
    data = request.json
    
    if not data or 'message' not in data or not isinstance(data['message'], str):
        logger.error("Chatbot request failed: No message provided or message is not a string.")
        return jsonify({"error": "Message is required and must be a string."}), 400
    
    # ANALYTICS: Log that a message is being processed
    logger.info("ANALYTICS: MessageProcessed")

    user_message_sanitized = html.escape(data['message']) # Sanitize for general processing
    
    conversation_history = data.get('conversation_history', [])

    if not is_valid_conversation_history(conversation_history):
        logger.error("Chatbot request failed: Invalid conversation history format.")
        return jsonify({"error": "Invalid conversation_history format."}), 400

    logger.info(f"Received message: {data['message']} (Sanitized: {user_message_sanitized})")
    logger.info(f"Conversation history: {conversation_history}")

    # Regular chat flow
    api_response_data = call_deepseek_api(user_message_sanitized, conversation_history)
    logger.info(f"RAW DEEPSEEK API RESPONSE: {json.dumps(api_response_data)}")
    
    if api_response_data.get('error'):
        logger.error(f"Error from DeepSeek API: {api_response_data.get('error')}")
        return jsonify({"error": "Sorry, I'm having trouble connecting to my brain right now."}), 500
    
    assistant_response_content = extract_assistant_response(api_response_data)
    
    if not assistant_response_content:
        logger.error("Could not extract assistant response from DeepSeek API.")
        return jsonify({"error": "Sorry, I couldn't generate a response."}), 500
    
    final_assistant_response_for_user = assistant_response_content # Default to full response

    # Check for lead capture marker
    lead_capture_marker = "[LEAD_INFO_COLLECTED]"
    if lead_capture_marker in assistant_response_content:
        logger.info("Lead capture marker detected in assistant response.")
        
        # The AI is instructed to provide its conversational response *before* the marker on a new line.
        # So, the user-facing part is everything before the marker.
        user_facing_part = assistant_response_content.split(lead_capture_marker, 1)[0].strip()
        
        if user_facing_part:
            final_assistant_response_for_user = user_facing_part
            logger.info(f"Using content before marker for user: '{final_assistant_response_for_user}'")
        else:
            # This is a fallback if the AI unexpectedly puts the marker at the very start
            # or if the content before is just whitespace. We try to give a generic confirmation.
            final_assistant_response_for_user = "Thanks! I've noted your information and Reid will be in touch."
            logger.warning(f"No significant user-facing content found before marker. Using generic fallback: '{final_assistant_response_for_user}'")

        # Parsing lead details (existing logic, ensure it targets the content *after* the marker)
        parsed_details = {}
        try:
            # Ensure payload_str for parsing is *only* the content of the marker line
            marker_content_line = assistant_response_content.split(lead_capture_marker, 1)[1].strip()
            
            # More robust regex to capture fields, especially multi-part messages
            # This regex tries to capture known fields and then takes everything for Message
            # It makes LastName and Phone optional in the capture group
            lead_pattern = re.compile(
                r"FirstName: (?P<FirstName>[^,]+)(?:,\s*LastName: (?P<LastName>[^,]+))?,\s*Email: (?P<Email>[^,]+)(?:,\s*Phone: (?P<Phone>[^,]+))?,\s*Message: (?P<Message>.+)"
            )
            match = lead_pattern.search(marker_content_line)

            if match:
                parsed_details = {k: v.strip() if v else "N/A" for k, v in match.groupdict().items()}
            else:
                # Fallback to simpler split if regex fails, though this is less robust for messages with commas
                logger.warning(f"Complex regex failed for lead parsing on: {marker_content_line}. Falling back to simple split.")
                parts = marker_content_line.split(", ") 
                for part in parts:
                    if ":" in part:
                        key, value = part.split(":", 1)
                        raw_key = key.strip()
                        # Standardize key (existing logic)
                        if raw_key.lower() == "firstname": standardized_key = "FirstName"
                        elif raw_key.lower() == "lastname": standardized_key = "LastName"
                        elif raw_key.lower() == "email": standardized_key = "Email"
                        elif raw_key.lower() == "phone": standardized_key = "Phone"
                        elif raw_key.lower() == "message": standardized_key = "Message"
                        else: standardized_key = raw_key.capitalize()
                        parsed_details[standardized_key] = value.strip()
            
            logger.info(f"Parsed lead details from marker: {parsed_details}")

            # Validate essential fields for n8n after parsing
            if not parsed_details.get("Email") and not parsed_details.get("Message") and not parsed_details.get("FirstName"):
                 logger.warning("Lead capture attempted but critical info (FirstName, Email, Message) might be missing.")
        
        except Exception as e:
            logger.error(f"Error parsing lead details from AI response marker: {e}. Marker content was: '{assistant_response_content.split(lead_capture_marker, 1)[1] if lead_capture_marker in assistant_response_content else assistant_response_content}'")
            parsed_details = {"Message": f"AI tried to capture lead. Full AI response: {assistant_response_content}", "InquiryType": "AI Chat Lead (Parsing Error)"}

        # Ensure minimum required fields exist for n8n, even if empty, to avoid key errors in n8n_handler
        # The n8n_handler itself expects FirstName, Email, Message as per its docstring, others are optional.
        for key in ["FirstName", "LastName", "Email", "Phone", "Message"]:
            if key not in parsed_details:
                 parsed_details[key] = "N/A" # Or empty string, depending on how n8n handles it
        
        if send_chat_lead_to_n8n(parsed_details):
            logger.info("Successfully sent lead to n8n.")
        else:
            logger.error("Failed to send lead to n8n.")
            # If n8n fails, the user still sees the AI's conversational confirmation.
            # Consider adding a subtle hint in final_assistant_response_for_user if critical.
            
    logger.info(f"Sending final assistant response to user: {final_assistant_response_for_user}")
    return jsonify({
        "response": final_assistant_response_for_user
    })

@app.route('/api/chatbot/greeting', methods=['GET'])
@limiter.limit("30 per minute") # Apply a slightly more relaxed limit for greetings
def chatbot_greeting():
    """Return the initial greeting message for the chatbot."""
    greeting = "Hi there! I'm the AI assistant for Reusch AI Solutions. You can ask me about AI topics, our services in general, or I can help you get in touch with Reid. What's on your mind?"
    logger.info(f"Sending greeting: {greeting}")
    return jsonify({"greeting": greeting})

# api/__init__.py already imports this module (chatbot)
# Example: from . import chatbot
# This will be handled in a subsequent step. 