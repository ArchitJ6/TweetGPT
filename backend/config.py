import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama

# Load environment variables
load_dotenv()

# Twitter OAuth2 configuration
CLIENT_ID = os.getenv("X_CLIENT_ID")
CLIENT_SECRET = os.getenv("X_CLIENT_SECRET")
REDIRECT_URI = os.getenv("X_REDIRECT_URI")
AUTH_URL = os.getenv("X_AUTH_URL")
TOKEN_URL = os.getenv("X_TOKEN_URL")

if not CLIENT_ID or not CLIENT_SECRET:
    raise EnvironmentError("X_CLIENT_ID or X_CLIENT_SECRET is not set. Please configure them in the environment variables.")

# Ensure the redirect URI is set correctly
if not REDIRECT_URI:
    raise EnvironmentError("REDIRECT_URI is not set. Please configure it in the environment variables.")

# Ensure the AUTH_URL and TOKEN_URL are set correctly
if not AUTH_URL or not TOKEN_URL:
    raise EnvironmentError("AUTH_URL or TOKEN_URL is not set. Please configure them in the environment variables.")

# Groq LLM configuration
GROQ_LLM_MODEL_NAME = os.getenv("GROQ_LLM_MODEL_NAME", "llama-3.3-70b-versatile")

# Ollama LLM configuration
OLLAMA_MODEL_NAME = os.getenv("OLLAMA_MODEL_NAME", "llama3.1:latest")

# Ensure the Groq API key is set
if not os.getenv("GROQ_API_KEY"):
    raise EnvironmentError("GROQ_API_KEY is missing from the environment")

# Initialize Groq models with environment key
USE_OLLAMA = os.getenv("USE_OLLAMA", "False").lower() in ("true", "1", "yes")
if USE_OLLAMA:
    llm_generate = ChatOllama(model=OLLAMA_MODEL_NAME)
    llm_evaluate = ChatOllama(model=OLLAMA_MODEL_NAME)
    llm_refine = ChatOllama(model=OLLAMA_MODEL_NAME)
else:
    llm_generate = ChatGroq(model_name=GROQ_LLM_MODEL_NAME, temperature=2)
    llm_evaluate = ChatGroq(model_name=GROQ_LLM_MODEL_NAME)
    llm_refine = ChatGroq(model_name=GROQ_LLM_MODEL_NAME)