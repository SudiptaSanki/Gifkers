from pydantic import BaseModel, Field
from typing import Optional

class CodePayload(BaseModel):
    code: str = Field(..., description="Python code string to execute")
    aspect_ratio: str = Field("auto", description="Aspect ratio preset or auto")
    width: int = Field(800, ge=50, le=4096, description="Frame width in pixels")
    height: int = Field(800, ge=50, le=4096, description="Frame height in pixels")

class StickerResponse(BaseModel):
    status: str
    type: str
    mime_type: Optional[str] = "image/png"
    image_base64: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
