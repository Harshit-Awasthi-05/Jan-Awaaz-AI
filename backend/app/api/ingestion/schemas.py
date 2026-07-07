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
    from_number: str = Field(..., alias="From")         
    to_number: str = Field(..., alias="To")             
    body: Optional[str] = Field(None, alias="Body")     #
    num_media: int = Field(0, alias="NumMedia")         
    media_url_0: Optional[str] = Field(None, alias="MediaUrl0")
    media_content_type_0: Optional[str] = Field(None, alias="MediaContentType0")
    message_sid: Optional[str] = Field(None, alias="MessageSid")
    account_sid: Optional[str] = Field(None, alias="AccountSid")
    sms_sid: Optional[str] = Field(None, alias="SmsSid")
    profile_name: Optional[str] = Field(None, alias="ProfileName")

    model_config = {"populate_by_name": True}

class CitizenAppPayload(BaseModel):
    citizen_id: str
    latitude: float
    longitude: float
    category: Optional[str] = None
    description: Optional[str] = None
    constituency: Optional[str] = None
    language: Optional[str] = "en"