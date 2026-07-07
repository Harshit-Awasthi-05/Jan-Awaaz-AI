import json
import io
from PIL import Image
from google import genai
from app.core.config import settings
from app.core.logger import log

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def analyze_citizen_report(text_content: str = None, file_bytes: bytes = None, language: str = "en") -> dict:
    lang_instruction = (
        "Write the 'summary' and 'actionable_insight' fields in Hindi (Devanagari script)."
        if language == "hi"
        else "Write the 'summary' and 'actionable_insight' fields in English."
    )

    prompt = f"""
    Analyze this local citizen report.
    Return ONLY a valid JSON object with the following keys and strictly no markdown formatting or backticks:
    - category: (Road, Water, Electricity, Sanitation, Health, Law & Order, Other) — always in English, exactly one of these values.
    - severity: (High, Medium, Low) — always in English, exactly one of these values.
    - summary: A crisp 1-sentence summary of the issue.
    - actionable_insight: One immediate step the local government or MP should take.

    {lang_instruction}
    Do NOT translate or localize the 'category' or 'severity' values — they must always be exactly one of the English options listed above, regardless of the language used for summary/actionable_insight.
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
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
        )
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