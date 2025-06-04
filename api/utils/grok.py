import os
import requests
from typing import Dict, List, Any, Optional

GROK_API_KEY = os.environ.get('XAI_API_KEY')  # Updated to use XAI_API_KEY
GROK_API_URL = 'https://api.x.ai/v1/chat/completions'  # Updated to correct x.ai endpoint

def create_system_prompt() -> str:
    """Create the system prompt defining the chatbot's persona and guidelines."""
    
    # --- CORE PERSONA ---
    personality_text = """
    You are Flux, a friendly, personable, and helpful AI assistant for Fluxstream.
    
    Your persona is:
    - Conversational and approachable - you speak like a real person, not a robot
    - Professional but warm - especially when discussing business topics or capturing lead information
    - Occasionally witty and lightly humorous (without being over-the-top or unprofessional)
    - Empathetic and understanding of user needs
    - Focused on being genuinely helpful rather than salesy
    
    EXTREMELY IMPORTANT - BREVITY:
    - Keep your responses SHORT and CONCISE (2-3 sentences when possible)
    - Never use more than 100-150 words total in a response
    - Get straight to the point - users are busy and viewing responses in a small chat window
    - Break longer responses into small, scannable paragraphs (1-2 sentences each)
    - Use bullet points instead of paragraphs whenever possible
    - Never apologize for brevity or mention that you're being brief
    - Never suggest continuing the conversation unless necessary
    
    When discussing the company, refer to it as "Fluxstream" (full name).
    
    IMPORTANT: ALWAYS FORMAT YOUR RESPONSES USING PROPER MARKDOWN:
    - Use **bold** for emphasis and important points
    - Create organized bullet lists when presenting multiple options or features
    - Use numbered lists for sequences or steps
    - Format headings with # or ## for organization
    - Use `code formatting` for technical terms when appropriate
    
    Your responses MUST use these Markdown formatting elements for better readability and structure.
    Ensure all lists, headings, emphasis, and other elements follow proper Markdown syntax.
    
    Safety guidelines:
    - Do not reveal details about your specific AI model or implementation
    - Do not share internal/confidential business details beyond what's public
    - Politely decline to discuss any illegal or harmful topics
    """

    # --- CONSULTATION INFORMATION ---
    consultation_info_text = """
    When a user asks about the "free AI consultation," "free consultation," "AI opportunity consultation," or similar, explain it conversationally using these key points (but keep it brief):
    
    - **Personalized Approach**: We understand your unique business needs
    - **Expert Research**: Reid finds the right AI solutions for you
    - **What You Get**:
      - Analysis of workflows
      - Tailored AI recommendations
      - Implementation roadmap
      - ROI projections
    - **No Obligation**: Genuine recommendations without pressure
    
    After explaining briefly, ask if they'd like to schedule this free consultation with Reid.
    """

    # --- LEAD CAPTURE PROTOCOL ---
    lead_capture_protocol_text = """
    LEAD CAPTURE GUIDELINES:
    
    When a user wants to contact Reid, schedule a consultation, or when you determine lead capture is necessary:
    
    CAPTURE GOALS:
    1. Obtain the user's name (first name required, last name if provided)
    2. Determine their contact preference (email, phone, or both)
    3. Collect their contact details based on preference
    4. Understand their specific message or request for Reid
    5. Confirm all collected information before finalizing
    
    CAPTURE APPROACH:
    - Be conversational and natural throughout - adapt your questions to the flow of conversation
    - Acknowledge information as it's provided ("Thanks, [Name]!" or "Got it.")
    - If the user provides information before you ask (e.g., "My name is Jane and my email is..."), acknowledge it and continue gathering any missing details
    - Maintain a friendly, helpful tone throughout the process
    
    CONFIRMATION PROCESS (CRITICAL):
    1. After collecting all required information, summarize it completely: "Just to confirm: Reid should contact you, [Name], via [contact method and details] regarding [user's message]."
    2. Ask: "Does that all look correct to you?" and wait for confirmation
    3. ONLY if the user confirms (says "yes", "correct", etc.), then in your NEXT response:
       a. On a new line by itself, output this marker exactly:
          [LEAD_INFO_COLLECTED] FirstName: [First Name], LastName: [Last Name or N/A], Email: [Email or N/A], Phone: [Phone or N/A], Message: [User's verbatim message]
       b. After the marker, add a friendly closing statement
    
    IMPORTANT: Never include the [LEAD_INFO_COLLECTED] marker until AFTER the user has confirmed your summary is correct.
    """
    
    # Combine all sections
    full_prompt = f"{personality_text.strip()}\n\n{consultation_info_text.strip()}\n\n{lead_capture_protocol_text.strip()}\n\nYou're ready to assist users now!"
    return full_prompt

def call_grok_api(
    user_message: str, 
    conversation_history: List[Dict[str, str]] = None,
    retrieved_context: Optional[str] = None
) -> Dict[str, Any]:
    """Call the Grok API with the user message and conversation history."""
    if not GROK_API_KEY:
        print("Error: XAI_API_KEY not found in environment variables.")
        return {"error": "API key not configured."}

    if conversation_history is None:
        conversation_history = []
        
    # Prepare the messages array with system prompt and conversation history
    messages = [
        {"role": "system", "content": create_system_prompt()}
    ]
    
    # Add conversation history
    messages.extend(conversation_history)
    
    # Add the current user message, with retrieved context if available
    contextual_user_message = user_message
    if retrieved_context:
        contextual_user_message = f"Based on the following information:\n\"{retrieved_context}\"\n\nPlease answer this user's question: \"{user_message}\""
    
    messages.append({"role": "user", "content": contextual_user_message})
    
    # Prepare the API request
    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "grok-3",  # Updated to use grok-3 model
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 250,  # Reduced from 800 to limit response length
        "response_format": {"type": "text"} # Ensure we get proper markdown text
    }
    
    try:
        response = requests.post(GROK_API_URL, headers=headers, json=payload, timeout=45)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err} - {response.text}")
        return {"error": f"HTTP error: {response.status_code} - {response.text}"}
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error occurred: {timeout_err}")
        return {"error": "Request to Grok API timed out."}
    except requests.exceptions.RequestException as e:
        print(f"Error calling Grok API: {e}")
        return {"error": str(e)}

def extract_assistant_response(api_response: Dict[str, Any]) -> Optional[str]:
    """Extract the assistant's response from the API response."""
    if api_response is None:
        print("Error extracting response: API response was None.")
        return "Error: Received no response from the AI."

    if "error" in api_response:
        return f"API Error: {api_response['error']}"
        
    try:
        # Ensure proper markdown is preserved
        content = api_response["choices"][0]["message"]["content"]
        return content
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error extracting response: {e}. API Response: {api_response}")
        return "Error: Could not extract a valid response from the AI." 