import os
import requests
from typing import Dict, List, Any, Optional

DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'  # Confirmed via docs, task details use /v1/

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
    
    When discussing the company, refer to it as "Fluxstream" (full name).
    
    Format your responses using Markdown for better readability:
    - Use **bold** for emphasis and important points
    - Create organized *bullet lists* when presenting multiple options or features
    - Use numbered lists for sequences or steps
    - Format headings appropriately when organizing information
    
    Safety guidelines:
    - Do not reveal details about your specific AI model or implementation
    - Do not share internal/confidential business details beyond what's public
    - Politely decline to discuss any illegal or harmful topics
    """

    # --- CONSULTATION INFORMATION ---
    consultation_info_text = """
    When a user asks about the "free AI consultation," "free consultation," "AI opportunity consultation," or similar, explain it conversationally using these key points:
    
    - It's a **Personalized Approach** - We start by understanding the unique business needs
    - There's **Behind-the-Scenes Research** - Reid Reusch personally investigates the specific situation, using an internal database of 50+ specialized AI tools
    - Users receive a **Comprehensive Deliverable** including:
      - Analysis of current workflows
      - 2-3 specific AI tool recommendations tailored to their needs
      - Implementation roadmaps
      - Potential ROI projections
      - Cost/benefit analysis
    - There's **No Obligation** - genuine recommendations without pressure, perhaps just asking for a brief testimonial if they find it valuable
    
    Common areas we help with include:
    - Automating repetitive tasks
    - Enhancing customer communications
    - Improving content creation
    - Optimizing marketing efforts
    - Streamlining operations
    - Better data analysis and reporting
    
    After explaining, ask if they'd like to schedule this free consultation with Reid. If they express interest, initiate the lead capture process.
    """

    # --- LEAD CAPTURE PROTOCOL - MORE GOAL-ORIENTED ---
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
    
    HANDLING CORRECTIONS:
    - If the user says your summary is incorrect, ask what needs to be fixed
    - Collect the corrected information and then re-summarize
    - Only proceed with the marker after receiving confirmation
    
    The format of your final response after confirmation must be:
    
    [LEAD_INFO_COLLECTED] FirstName: Jane, LastName: Doe, Email: jane@example.com, Phone: N/A, Message: User's actual message here.
    
    Great! I've passed your information along to Reid. He'll be in touch with you soon!
    """
    
    # Combine all sections
    full_prompt = f"{personality_text.strip()}\n\n{consultation_info_text.strip()}\n\n{lead_capture_protocol_text.strip()}\n\nYou're ready to assist users now!"
    return full_prompt

def call_deepseek_api(
    user_message: str, 
    conversation_history: List[Dict[str, str]] = None,
    retrieved_context: Optional[str] = None
) -> Dict[str, Any]:
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
    
    # Add the current user message, with retrieved context if available
    contextual_user_message = user_message
    if retrieved_context:
        contextual_user_message = f"Based on the following information:\n\"{retrieved_context}\"\n\nPlease answer this user's question: \"{user_message}\""
    
    messages.append({"role": "user", "content": contextual_user_message})
    
    # Prepare the API request
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 800  # Increased from 500 to allow for more detailed responses
    }
    
    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=45)  # Increased timeout
        response.raise_for_status()
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
    if api_response is None:
        print("Error extracting response: API response was None.")
        return "Error: Received no response from the AI."

    if "error" in api_response:
        return f"API Error: {api_response['error']}"
        
    try:
        return api_response["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error extracting response: {e}. API Response: {api_response}")
        return "Error: Could not extract a valid response from the AI."

def extract_lead_info(response: str) -> Optional[Dict[str, str]]:
    """
    Extract lead information from a response containing the [LEAD_INFO_COLLECTED] marker.
    Returns a dictionary with the extracted information or None if the marker is not found.
    """
    if not response or "[LEAD_INFO_COLLECTED]" not in response:
        return None
    
    try:
        # Find the line with the marker
        lines = response.split('\n')
        marker_line = ""
        for line in lines:
            if "[LEAD_INFO_COLLECTED]" in line:
                marker_line = line.strip()
                break
        
        if not marker_line:
            return None
            
        # Extract the information after the marker
        info_part = marker_line.split("[LEAD_INFO_COLLECTED]")[1].strip()
        
        # Parse the fields
        lead_info = {}
        fields = ["FirstName", "LastName", "Email", "Phone", "Message"]
        
        # Start with an empty accumulator for the current field value
        current_field = None
        accumulated_value = ""
        
        # Split the info part by commas, but be careful with the Message field which might contain commas
        parts = info_part.split(', ')
        
        for i, part in enumerate(parts):
            # For the first few fields (before Message)
            if i < len(parts) - 1 and any(f"{field}:" in part for field in fields[:-1]):
                if current_field:
                    lead_info[current_field] = accumulated_value.strip()
                
                field_name, field_value = part.split(':', 1)
                current_field = field_name.strip()
                accumulated_value = field_value.strip()
            # For the Message field (which may contain commas)
            elif "Message:" in part or current_field == "Message":
                if "Message:" in part and current_field != "Message":
                    if current_field:
                        lead_info[current_field] = accumulated_value.strip()
                    current_field = "Message"
                    accumulated_value = part.split('Message:', 1)[1].strip()
                else:
                    accumulated_value += ", " + part
        
        # Add the last field
        if current_field:
            lead_info[current_field] = accumulated_value.strip()
            
        return lead_info
    except Exception as e:
        print(f"Error extracting lead info: {e}")
        return None 