import requests
import os
import logging

logger = logging.getLogger(__name__)

# IMPORTANT: You'll set this environment variable with the new webhook URL from n8n
N8N_CHAT_LEAD_WEBHOOK_URL = os.environ.get('N8N_CHAT_LEAD_WEBHOOK_URL') 

def send_chat_lead_to_n8n(lead_details: dict):
    """
    Sends collected lead details to the n8n workflow for AI Chat Leads.
    Args:
        lead_details (dict): A dictionary containing lead information. 
                             Expected keys: "FirstName", "Email", "Message".
                             Optional: "LastName", "Phone", "InquiryType".
    """
    if not N8N_CHAT_LEAD_WEBHOOK_URL:
        logger.error("N8N_CHAT_LEAD_WEBHOOK_URL is not set in environment variables. Cannot send chat lead.")
        return False

    # Prepare payload matching what the n8n "Set" node expects in $json.body
    # The n8n "Set" node will use expressions like {{ $json.body.FirstName || "" }}
    payload = {
        "FirstName": lead_details.get("FirstName", ""),
        "LastName": lead_details.get("LastName", ""), # AI not prompted for this, likely empty
        "Email": lead_details.get("Email", ""),
        "Phone": lead_details.get("Phone", ""),       # AI not prompted for this, likely empty
        "InquiryType": lead_details.get("InquiryType", "AI Chat Lead"), # Default if not specified
        "Message": lead_details.get("Message", "")
    }
    
    try:
        response = requests.post(N8N_CHAT_LEAD_WEBHOOK_URL, json=payload, timeout=15)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        logger.info(f"Successfully sent chat lead to n8n: {payload.get('Email')}")
        return True
    except requests.exceptions.Timeout:
        logger.error(f"Timeout error sending chat lead to n8n for {payload.get('Email')}.")
        return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Error sending chat lead to n8n for {payload.get('Email')}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"n8n response status: {e.response.status_code}, text: {e.response.text}")
        return False 