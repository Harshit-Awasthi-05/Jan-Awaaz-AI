from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Literal, Dict, Any

class CitizenReportIncoming(BaseModel):
    user_id: str = Field(..., description="Unique hash string identifier for the citizen.")
    message_type: Literal["text", "image", "audio"] = Field(..., description="The modality classification of input.")
    text_content: Optional[str] = Field(None, description="Raw transcription context or message body.")
    media_url: Optional[HttpUrl] = Field(None, description="Publicly accessible bucket or proxy link for media streams.")

class ProcessingResponse(BaseModel):
    status: str = Field(..., example="success")
    message: str = Field(..., example="Report analyzed and categorized accurately.")
    extracted_data: Optional[Dict[str, Any]] = Field(None, description="The structural JSON payload resolved from Gemini.")

class WhatsAppWebhookPayload(BaseModel):
    from_number: str
    message_type: str 
    text_body: Optional[str] = None
    media_url: Optional[str] = None
    timestamp: str

class CitizenAppPayload(BaseModel):
    citizen_id: str
    latitude: float
    longitude: float
    category: Optional[str] = None
    description: Optional[str] = None
    constituency: Optional[str] = "Central District" 