from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.shared.config import settings
from app.presentation.routes.api import api_router
from app.infrastructure.database.base import Base, engine

app = FastAPI(
    title="ninareru",
    description="ninareru sns auth app",
    version="0.1.0",
    debug=settings.debug
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def on_startup():
    """Create database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to ninareru sns auth app"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"} 
