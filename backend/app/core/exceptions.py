from fastapi import HTTPException, status

class JanAwaazException(HTTPException):
    """Base exception for the application to ensure consistent structure."""
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class InvalidCredentialsException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid government credentials or constituency mismatch."
        )

class InvalidOTPException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The entered OTP is invalid or has expired."
        )

class SessionExpiredException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please log in again using MFA."
        )


class InvalidDeviceFingerprintException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Missing or corrupted anonymous device fingerprint."
        )

class RateLimitExceededException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Submission quota exceeded. Please wait before submitting another report."
        )

class InvalidPayloadException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The submitted report payload is malformed or missing media links."
        )


class PubSubPublishFailureException(JanAwaazException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Ingestion queue is temporarily congested. Please retry in a few moments."
        )