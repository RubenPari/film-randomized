import logging
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from core.database import get_db, engine
from core.models import Base, WatchlistItem
from core.schemas import (
    WatchlistItemCreate,
    WatchlistItemResponse,
    WatchlistCheckResponse,
)


# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Film Randomized API",
    description="API per gestire la watchlist di film e serie TV",
    version="1.0.0"
)

logger = logging.getLogger(__name__)

# Configure CORS
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    # "https://tuo-dominio.railway.app",  # Aggiungi qui il dominio di produzione
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files configuration for production
FRONTEND_DIR = Path(__file__).parent.parent / "frontend" / "dist"

if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Film Randomized API is running"}

@app.post("/api/watchlist", response_model=WatchlistItemResponse, status_code=201)
def add_to_watchlist(item: WatchlistItemCreate, db: Session = Depends(get_db)):
    """
    Add a media item to the watchlist
    """
    try:
        # Check if item already exists
        existing_item = db.query(WatchlistItem).filter(
            WatchlistItem.tmdb_id == item.tmdb_id
        ).first()

        if existing_item:
            raise HTTPException(
                status_code=400,
                detail="Questo contenuto è già presente nella watchlist"
            )

        # Create new watchlist item
        db_item = WatchlistItem(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)

        return db_item.to_dict()

    except IntegrityError:
        db.rollback()
        logger.exception("Integrity error while adding watchlist item")
        raise HTTPException(
            status_code=400,
            detail="Errore di integrità del database",
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        logger.exception("Unexpected error while adding watchlist item")
        raise HTTPException(
            status_code=500,
            detail="Errore interno del server",
        )


@app.get("/api/watchlist", response_model=List[WatchlistItemResponse])
def get_watchlist(db: Session = Depends(get_db)):
    """
    Get all items in the watchlist
    """
    try:
        items = db.query(WatchlistItem).order_by(WatchlistItem.created_at.desc()).all()
        return [item.to_dict() for item in items]
    except Exception:
        logger.exception("Unexpected error while fetching watchlist")
        raise HTTPException(
            status_code=500,
            detail="Errore interno del server",
        )


@app.get("/api/watchlist/{tmdb_id}", response_model=WatchlistCheckResponse)
def check_in_watchlist(tmdb_id: int, db: Session = Depends(get_db)):
    """
    Check if a media item is in the watchlist
    """
    try:
        item = db.query(WatchlistItem).filter(
            WatchlistItem.tmdb_id == tmdb_id
        ).first()

        # Compatibile con il frontend attuale: usa solo in_watchlist.
        return {"in_watchlist": item is not None}
    except Exception:
        logger.exception("Unexpected error while checking watchlist item")
        raise HTTPException(
            status_code=500,
            detail="Errore interno del server",
        )


@app.delete("/api/watchlist/{tmdb_id}", status_code=204)
def remove_from_watchlist(tmdb_id: int, db: Session = Depends(get_db)):
    """
    Remove a media item from the watchlist
    """
    try:
        item = db.query(WatchlistItem).filter(
            WatchlistItem.tmdb_id == tmdb_id
        ).first()

        if not item:
            raise HTTPException(
                status_code=404,
                detail="Contenuto non trovato nella watchlist",
            )

        db.delete(item)
        db.commit()

        return None
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        logger.exception("Unexpected error while deleting watchlist item")
        raise HTTPException(
            status_code=500,
            detail="Errore interno del server",
        )


# Serve frontend for all other routes (SPA support)
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """
    Serve the frontend application for all non-API routes
    """
    if FRONTEND_DIR.exists():
        file_path = FRONTEND_DIR / full_path
        
        # If file exists and is not a directory, serve it
        if file_path.is_file():
            return FileResponse(file_path)
        
        # Otherwise serve index.html for client-side routing
        index_file = FRONTEND_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
    
    raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
