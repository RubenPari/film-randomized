from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class WatchlistItem(Base):
    """
    Model for watchlist items
    Stores media (movies or TV shows) that users want to watch
    """
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(Integer, unique=True, nullable=False, index=True)
    media_type = Column(Boolean, nullable=False)  # True = movie, False = TV show
    title = Column(String(500), nullable=False)
    original_title = Column(String(500))
    overview = Column(Text)
    poster_path = Column(String(200))
    backdrop_path = Column(String(200))
    vote_average = Column(Float)
    vote_count = Column(Integer)
    release_date = Column(String(50))
    genres = Column(Text)  # Stored as JSON string
    runtime = Column(Integer, nullable=True)  # For movies
    number_of_seasons = Column(Integer, nullable=True)  # For TV shows
    number_of_episodes = Column(Integer, nullable=True)  # For TV shows
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert model instance to dictionary"""
        return {
            "id": self.id,
            "tmdb_id": self.tmdb_id,
            "media_type": self.media_type,
            "title": self.title,
            "original_title": self.original_title,
            "overview": self.overview,
            "poster_path": self.poster_path,
            "backdrop_path": self.backdrop_path,
            "vote_average": self.vote_average,
            "vote_count": self.vote_count,
            "release_date": self.release_date,
            "genres": self.genres,
            "runtime": self.runtime,
            "number_of_seasons": self.number_of_seasons,
            "number_of_episodes": self.number_of_episodes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
