import pytest
from unittest.mock import patch, MagicMock
import os

# Adjust the import path based on your project structure
# This assumes 'api' is a package and your tests are run from the project root
from api.utils.deepseek import create_system_prompt, call_deepseek_api, extract_assistant_response

# Expected system prompt for comparison
SYSTEM_PROMPT = """
You are an AI assistant for Fluxstream. Your name is not important, and if asked, \
you should say you're the AI assistant for Fluxstream. Be conversational, casual, \
friendly, and helpful. Do not be overly verbose or robotic. If you don't know \
something, say you don't know. Don't make up answers. You are an expert in AI, \
and can discuss topics related to AI, machine learning, and natural language processing, and how it can help businesses.

Do NOT discuss or answer questions about:
- Your specific AI model or architecture (e.g., DeepSeek, number of parameters, training data)
- Generating code (unless it's a very simple, illustrative example related to an AI concept)
- Illegal activities or hate speech
- Confidential website/business information about Fluxstream\

If asked about these, politely decline.
"""

def test_create_system_prompt():
    """Test that the system prompt is generated as expected."""
    prompt = create_system_prompt()
    assert prompt == SYSTEM_PROMPT

# --- Tests for call_deepseek_api --- 

@patch('api.utils.deepseek.requests.post')
@patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test_api_key"})
def test_call_deepseek_api_successful(mock_post):
    """Test a successful API call."""
    mock_response = MagicMock()
    mock_response.json.return_value = {"choices": [{"message": {"content": "Hello there!"}}]}
    mock_response.status_code = 200
    mock_post.return_value = mock_response

    response = call_deepseek_api("Hello")
    assert response == {"choices": [{"message": {"content": "Hello there!"}}]}
    mock_post.assert_called_once()
    # We can add more assertions here to check the payload sent to mock_post
    # For example, checking if the system prompt was part of the messages
    args, kwargs = mock_post.call_args
    assert any(msg['role'] == 'system' and msg['content'] == SYSTEM_PROMPT for msg in kwargs['json']['messages'])
    assert any(msg['role'] == 'user' and msg['content'] == 'Hello' for msg in kwargs['json']['messages'])

def test_call_deepseek_api_no_api_key():
    """Test API call when DEEPSEEK_API_KEY is not set."""
    with patch.dict(os.environ, {}, clear=True):
        with patch('api.utils.deepseek.DEEPSEEK_API_KEY', None):
            with patch('api.utils.deepseek.requests.post') as mock_post_method:
                response = call_deepseek_api("Hello")
                assert response == {"error": "API key not configured."}
                mock_post_method.assert_not_called()

# Add more tests for other scenarios: HTTP errors, timeouts, other exceptions...

# --- Tests for extract_assistant_response --- 

def test_extract_assistant_response_successful():
    """Test successful extraction of assistant response."""
    api_response = {"choices": [{"message": {"content": "This is the AI."}}]}
    extracted = extract_assistant_response(api_response)
    assert extracted == "This is the AI."

def test_extract_assistant_response_api_error():
    """Test extraction when API response itself contains an error."""
    api_response = {"error": "API key not configured."}
    extracted = extract_assistant_response(api_response)
    assert extracted == "API Error: API key not configured."

def test_extract_assistant_response_malformed():
    """Test extraction with a malformed API response."""
    malformed_responses = [
        {},
        {"choices": []},
        {"choices": [{}]},
        {"choices": [{"message": {}}]}
    ]
    for resp in malformed_responses:
        extracted = extract_assistant_response(resp)
        assert extracted == "Error: Could not extract a valid response from the AI."

def test_extract_assistant_response_none_input():
    """Test extraction when None is passed (e.g., if call_deepseek_api failed catastrophically)."""
    # This case in extract_assistant_response is currently covered by "error" in api_response check
    # or the TypeError in the except block if a None somehow gets there.
    # If call_deepseek_api returns an error dict, that path is taken.
    # If it somehow returned None (it shouldn't based on current code), TypeError would be caught.
    extracted = extract_assistant_response(None) # type: ignore 
    assert extracted == "Error: Received no response from the AI." 