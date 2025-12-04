from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WatchlistItemCreate(BaseModel):
    """
    Schema for creating a new watchlist item
    """
    tmdb_id: int = Field(..., description="TMDB ID of the media")
    media_type: bool = Field(..., description="True for movie, False for TV show")
    title: str = Field(..., max_length=500)
    original_title: Optional[str] = Field(None, max_length=500)
    overview: Optional[str] = None
    poster_path: Optional[str] = Field(None, max_length=200)
    backdrop_path: Optional[str] = Field(None, max_length=200)
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    release_date: Optional[str] = Field(None, max_length=50)
    genres: Optional[str] = None  # JSON string
    runtime: Optional[int] = None
    number_of_seasons: Optional[int] = None
    number_of_episodes: Optional[int] = None

class WatchlistItemResponse(BaseModel):
    """
    Schema for watchlist item response
    """
    id: int
    tmdb_id: int
    media_type: bool
    title: str
    original_title: Optional[str]
    overview: Optional[str]
    poster_path: Optional[str]
    backdrop_path: Optional[str]
    vote_average: Optional[float]
    vote_count: Optional[int]
    release_date: Optional[str]
    genres: Optional[str]
    runtime: Optional[int]
    number_of_seasons: Optional[int]
    number_of_episodes: Optional[int]
    created_at: Optional[str]

    class Config:
        from_attributes = True


class WatchlistCheckResponse(BaseModel):
    """Schema for checking if an item is in the watchlist"""

    in_watchlist: bool
    item: Optional[WatchlistItemResponse] = None

