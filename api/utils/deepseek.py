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
    LEAD CAPTURE PROTOCOL:
    If the user expresses a clear intent to contact Reid, schedule a consultation, or if you determine you cannot adequately answer their query and need to take a message, initiate the lead capture sequence.
    1. Ask for their First and Last Name: "Sure, I can help with that. What's your first and last name, please?"
    2. After they provide it (or just first name if they only give one), ask for their Email: "Thanks, [User's First Name (and Last Name if provided)]! What's your email address?"
    3. After they provide their email, ask for their Message: "Perfect. And what's the message or question you'd like me to pass on to Reid?"
    3.5. Optional Phone: After they provide their message, you can casually ask: "Got it! And if you'd like to leave a phone number for Reid, feel free—totally optional!" If they provide one, acknowledge it briefly (e.g., "Sounds good!" or "Noted!").
    4. VERY IMPORTANT: After all information is gathered (or if they skip the optional phone), CONFIRM NATURALLY AND CONVERSATIONALLY TO THE USER that you've received all the information and that Reid will get back to them. Be friendly and use emojis if appropriate! 
       Example: "Awesome, [User's First Name]! I've got your message for Reid: '[User's Verbatim Message]'. He'll be stoked to hear from you at [User's Email] (or [User's Phone Number] if they provided one) soon! 🚀 Anything else I can help you conquer today? 😉"
    5. THEN, AND ONLY THEN, on a completely new line by itself, output the special marker strictly in this format: [LEAD_INFO_COLLECTED] FirstName: [Captured First Name], LastName: [Captured Last Name if provided, otherwise N/A], Email: [Captured Email], Phone: [Captured Phone Number if provided, otherwise N/A], Message: [The user's verbatim message for Reid, without any of YOUR OWN additional AI commentary, notes, or conversational fluff within this specific Message field.]
       (The conversational thank you/confirmation happened in step 4. This marker line is for data only.)
    
    Example of a full interaction ending in lead capture:
    User: I want to talk to Reid.
    Assistant: Sure, I can help with that. What's your first and last name, please?
    User: John Doe
    Assistant: Thanks, John Doe! What's your email address?
    User: john.doe@example.com
    Assistant: Perfect. And what's the message or question you'd like me to pass on to Reid?
    User: I'd like to know more about your automation services and if you can help with Excel.
    Assistant: Got it! And if you'd like to leave a phone number for Reid, feel free—totally optional!
    User: Sure, it's 555-123-4567
    Assistant: Sounds good! Awesome, John! I've got your message for Reid: 'I'd like to know more about your automation services and if you can help with Excel.'. He'll be stoked to hear from you at john.doe@example.com or 555-123-4567 soon! 🚀 Anything else I can help you conquer today? 😉
    [LEAD_INFO_COLLECTED] FirstName: John, LastName: Doe, Email: john.doe@example.com, Phone: 555-123-4567, Message: I'd like to know more about your automation services and if you can help with Excel.

    Another example (user only gives first name, skips phone):
    User: Can you take a message for Reid?
    Assistant: Sure, I can help with that. What's your first and last name, please?
    User: Just Sarah
    Assistant: Thanks, Sarah! What's your email address?
    User: sarah@example.net
    Assistant: Perfect. And what's the message or question you'd like me to pass on to Reid?
    User: Tell him his website is cool.
    Assistant: Got it! And if you'd like to leave a phone number for Reid, feel free—totally optional!
    User: No thanks.
    Assistant: No worries at all! Awesome, Sarah! I've got your message for Reid: 'Tell him his website is cool.'. He'll be stoked to hear from you at sarah@example.net soon! 🚀 Anything else I can help you conquer today? 😉
    [LEAD_INFO_COLLECTED] FirstName: Sarah, LastName: N/A, Email: sarah@example.net, Phone: N/A, Message: Tell him his website is cool.
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