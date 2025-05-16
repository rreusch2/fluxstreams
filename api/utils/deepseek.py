import os
import requests
from typing import Dict, List, Any, Optional

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'  # Confirmed via docs, task details use /v1/

def create_system_prompt() -> str:
    """Create the system prompt defining the chatbot's persona and guidelines."""
    return """\
    You are an AI assistant for Reusch AI Solutions. Your name is not important, and if asked, \
    you should say you're the AI assistant for Reusch AI Solutions. Be conversational, casual, \
    user-friendly, cool, but professional when discussing business or taking messages.\
    \
    You can discuss general AI topics, provide business advice, and answer very basic questions \
    about Reusch AI Solutions.\
    \
    DO NOT answer questions about:\
    - Your specific AI model or implementation details\
    - Confidential website/business information about Reusch AI Solutions\
    - Illegal topics or activities\
    \
    If asked about these topics, politely decline with 'Sorry, I can't answer that specific question.'\
    \
    If you cannot answer appropriately or if the user wants to contact someone, offer to take their \
    contact information (name, email, and message) to forward to Reid.\
    """

def call_deepseek_api(user_message: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    """Call the DeepSeek API with the user message and conversation history."""
    if not DEEPSEEK_API_KEY:
        print("Error: DEEPSEEK_API_KEY not found in environment variables.")
        return {"error": "API key not configured."}

    if conversation_history is None:
        conversation_history = []
        
    # Prepare the messages array with system prompt and conversation history
    messages = [
        {"role": "system", "content": create_system_prompt()}
    ]
    
    # Add conversation history
    messages.extend(conversation_history)
    
    # Add the current user message
    messages.append({"role": "user", "content": user_message})
    
    # Prepare the API request
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 500
    }
    
    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30) # Added timeout
        response.raise_for_status() # Will raise an HTTPError for bad responses (4XX or 5XX)
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err} - {response.text}")
        return {"error": f"HTTP error: {response.status_code} - {response.text}"}
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error occurred: {timeout_err}")
        return {"error": "Request to DeepSeek API timed out."}
    except requests.exceptions.RequestException as e:
        print(f"Error calling DeepSeek API: {e}")
        return {"error": str(e)}

def extract_assistant_response(api_response: Dict[str, Any]) -> Optional[str]:
    """Extract the assistant's response from the API response."""
    if api_response is None: # Explicitly handle None input
        print("Error extracting response: API response was None.")
        return "Error: Received no response from the AI."

    if "error" in api_response: # Pass through errors from call_deepseek_api
        return f"API Error: {api_response['error']}"
        
    try:
        return api_response["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as e: # Added TypeError for None response if API call failed badly
        print(f"Error extracting response: {e}. API Response: {api_response}")
        return "Error: Could not extract a valid response from the AI." 