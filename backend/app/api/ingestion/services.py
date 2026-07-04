import asyncio
import json
import logging
import httpx
from typing import Optional, Dict, Any
from google import genai
from google.cloud import speech
from app.core.config import settings
import os

logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self) -> None:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
        self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.speech_client = speech.SpeechClient()

    async def process_audio_uri(self, audio_url: str) -> str:
        try:
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="hi-IN",
                alternative_language_codes=["en-IN", "bn-IN"],
            )
            audio = speech.RecognitionAudio(uri=audio_url)
            
            def _execute_stt_call() -> str:
                response = self.speech_client.recognize(config=config, audio=audio)
                if response.results and response.results[0].alternatives:
                    return response.results[0].alternatives[0].transcript
                return ""

            transcript: str = await asyncio.to_thread(_execute_stt_call)
            return transcript
        except Exception as e:
            logger.error(f"Failed to process speech-to-text at execution: {str(e)}")
            raise RuntimeError(f"Speech conversion pipeline exception: {str(e)}")

    async def analyze_with_gemini(self, text: str, image_url: Optional[str] = None) -> Dict[str, Any]:
        structuring_prompt = f"""
        You are an advanced data extraction agent for public governance and infrastructure tracking.
        Analyze the following citizen report statement and extract contextual markers.
        
        Report Statement: "{text}"
        
        You must respond strictly with a valid JSON object matching this schema blueprint:
        {{
            "category": "ROADS" | "WATER" | "HEALTH" | "ELECTRICITY" | "WASTE" | "OTHER",
            "severity_score": integer between 1 and 10,
            "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "extracted_location": string or null,
            "summary_en": "A concise, clean English translation and summary of the core issue."
        }}
        Do not format your response with markdown backticks (e.g. do not wrap with ```json). 
        Return pure, raw JSON content string only.
        """
        
        try:
            image_part = None
            if image_url:
                async with httpx.AsyncClient() as client:
                    response = await client.get(image_url)
                    response.raise_for_status()
                    mime_type = response.headers.get("Content-Type", "image/jpeg")
                    image_part = genai.types.Part.from_bytes(data=response.content, mime_type=mime_type)

            def _execute_gemini_call() -> str:
                request_contents = [structuring_prompt]
                if image_part:
                    request_contents.append(image_part)
                    
                response = self.gemini_client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=request_contents,
                )
                return response.text if response.text else "{}"

            raw_response_text = await asyncio.to_thread(_execute_gemini_call)
            
            cleaned_json_string = raw_response_text.strip().replace("```json", "").replace("```", "")
            return json.loads(cleaned_json_string)
            
        except json.JSONDecodeError as json_err:
            logger.error(f"Gemini output parsing structural integrity failure: {str(json_err)}")
            raise RuntimeError(f"Invalid structural syntax from generation layout: {str(json_err)}")
        except Exception as general_err:
            logger.error(f"Failed execution context on Gemini validation layer: {str(general_err)}")
            raise RuntimeError(f"Generative transformation engine processing down: {str(general_err)}")