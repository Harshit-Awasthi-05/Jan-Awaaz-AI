import cloudinary
import cloudinary.uploader
from app.core.config import settings
from app.core.logger import log

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

class CloudinaryManager:
    async def upload_media(self, file_bytes: bytes, filename: str) -> str:
        try:
            log.info(f"Uploading {filename} to Cloudinary...")
            
            response = cloudinary.uploader.upload(
                file_bytes,
                resource_type="auto",
                folder="janawaaz_reports"
            )
            
            secure_url = response.get("secure_url")
            log.info(f"Upload successful: {secure_url}")
            return secure_url
            
        except Exception as e:
            log.error(f"Cloudinary Upload Failed: {e}")
            raise e