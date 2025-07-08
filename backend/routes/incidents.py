from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Incident
from schemas import IncidentCreate, IncidentResponse
from typing import List

# 🟢 ✅ DÉCLARATION DU ROUTEUR AVANT TOUT
router = APIRouter(
    prefix="/api/incidents",
    tags=["incidents"]
)

@router.post("/", response_model=IncidentResponse)
def create_incident(incident_data: IncidentCreate, db: Session = Depends(get_db)):
    new_incident = Incident(
        type_incident=incident_data.type_incident,
        ligne=incident_data.ligne,
        station=incident_data.station,
        description=incident_data.description,
        gravite=incident_data.gravite,
        contact_souhaite=incident_data.contact_souhaite or "non",
        email=incident_data.email
    )
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return new_incident

# Endpoint pour récupérer tous les incidents (pour le dashboard admin)
@router.get("/", response_model=List[IncidentResponse])
def get_all_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).all()
