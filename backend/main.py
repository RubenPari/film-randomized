from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
import json

from database import get_db, engine
from models import Base, WatchlistItem
from schemas import WatchlistItemCreate, WatchlistItemResponse

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Film Randomized API",
    description="API per gestire la watchlist di film e serie TV",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        raise HTTPException(
            status_code=400,
            detail="Errore di integrità del database"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/watchlist", response_model=List[WatchlistItemResponse])
def get_watchlist(db: Session = Depends(get_db)):
    """
    Get all items in the watchlist
    """
    try:
        items = db.query(WatchlistItem).order_by(WatchlistItem.created_at.desc()).all()
        return [item.to_dict() for item in items]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/watchlist/{tmdb_id}")
def check_in_watchlist(tmdb_id: int, db: Session = Depends(get_db)):
    """
    Check if a media item is in the watchlist
    """
    try:
        item = db.query(WatchlistItem).filter(
            WatchlistItem.tmdb_id == tmdb_id
        ).first()
        
        return {"in_watchlist": item is not None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
                detail="Contenuto non trovato nella watchlist"
            )
        
        db.delete(item)
        db.commit()
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
