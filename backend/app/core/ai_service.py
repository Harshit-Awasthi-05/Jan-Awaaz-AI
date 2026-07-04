import json
import io
from PIL import Image
import google.generativeai as genai
from app.core.config import settings
from app.core.logger import log

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def analyze_citizen_report(text_content: str = None, file_bytes: bytes = None) -> dict:
    prompt = """
    Analyze this local citizen report.
    Return ONLY a valid JSON object with the following keys and strictly no markdown formatting or backticks:
    - category: (Road, Water, Electricity, Sanitation, Health, Law & Order, Other)
    - severity: (High, Medium, Low)
    - summary: A crisp 1-sentence summary of the issue.
    - actionable_insight: One immediate step the local government or MP should take.
    """
    
    contents = [prompt]
    
    if text_content:
        contents.append(f"Citizen Description: {text_content}")
        
    if file_bytes:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            contents.append(image)
        except Exception as e:
            log.error(f"Image processing error for AI: {e}")
            
    try:
        response = model.generate_content(contents)
        response_text = response.text.strip()
        
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
            
        return json.loads(response_text)
        
    except Exception as e:
        log.error(f"AI Analysis Failed: {e}")
        return {
            "category": "Uncategorized",
            "severity": "High",
            "summary": "Manual review required due to AI processing error.",
            "actionable_insight": "Forward to human operator."
        }