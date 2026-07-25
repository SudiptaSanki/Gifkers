import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.schemas import CodePayload, StickerResponse, HealthResponse
from app.executor import execute_python_code

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory rate limiter to prevent infinite loop damage and abuse
RATE_LIMIT_ENABLED = True
RATE_LIMIT_WINDOW = 10  # seconds
MAX_REQUESTS_PER_WINDOW = 3

client_request_history = {}

def check_rate_limit(request: Request):
    if not RATE_LIMIT_ENABLED:
        return
    
    client_ip = request.client.host
    current_time = time.time()
    
    # Initialize history for this IP
    if client_ip not in client_request_history:
        client_request_history[client_ip] = []
        
    # Filter out old requests outside the time window
    client_request_history[client_ip] = [
        t for t in client_request_history[client_ip] 
        if current_time - t < RATE_LIMIT_WINDOW
    ]
    
    # Check if max requests exceeded
    if len(client_request_history[client_ip]) >= MAX_REQUESTS_PER_WINDOW:
        raise HTTPException(
            status_code=429, 
            detail="Rate limit exceeded. Please wait a few seconds to protect system resources."
        )
        
    # Add current request to history
    client_request_history[client_ip].append(current_time)

@app.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "online", "service": settings.PROJECT_NAME}

@app.post("/api/generate", response_model=StickerResponse)
def generate_sticker(payload: CodePayload, request: Request):
    check_rate_limit(request)
    try:
        result = execute_python_code(payload.code)
        return StickerResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Security Error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Execution Error: {str(e)}")

