from fastapi import FastAPI, HTTPException
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

@app.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "online", "service": settings.PROJECT_NAME}

@app.post("/api/generate", response_model=StickerResponse)
def generate_sticker(payload: CodePayload):
    try:
        result = execute_python_code(payload.code)
        return StickerResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Security Error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Execution Error: {str(e)}")
