from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class Forecast(Base):
    __tablename__ = 'forecasts'
    
    id = Column(Integer, primary_key=True, index=True)
    segment_id = Column(Integer, index=True)
    dt_iso = Column(String, index=True)
    wind_speed_ms = Column(Float)
    wind_deg = Column(Float)
    hs_m = Column(Float)
    tp_s = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

DATABASE_URL = "sqlite:///./data/data.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def save_forecast(segment_id, dt_iso, wind_speed_ms, wind_deg, hs_m, tp_s):
    db = SessionLocal()
    try:
        forecast = Forecast(
            segment_id=segment_id,
            dt_iso=dt_iso,
            wind_speed_ms=wind_speed_ms,
            wind_deg=wind_deg,
            hs_m=hs_m,
            tp_s=tp_s
        )
        db.add(forecast)
        db.commit()
        db.refresh(forecast)
        return forecast
    finally:
        db.close()

def get_forecasts(segment_id):
    db = SessionLocal()
    try:
        return db.query(Forecast).filter(Forecast.segment_id == segment_id).all()
    finally:
        db.close()