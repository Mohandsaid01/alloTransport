from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Incident
from database import get_db
from schemas import IncidentOut

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

@router.get("/", response_model=list[IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).all()
