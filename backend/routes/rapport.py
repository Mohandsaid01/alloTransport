from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import RapportCreate, RapportOut
from models import Rapport
from typing import List

router = APIRouter(
    prefix="/api/rapports",  # ✅ pour que l'URL /api/rapports existe
    tags=["rapports"]
)

@router.get("/", response_model=List[RapportOut])
def get_rapports(db: Session = Depends(get_db)):
    return db.query(Rapport).all()

@router.post("/{id}/valider")
def valider_rapport(id: int, db: Session = Depends(get_db)):
    rapport = db.query(Rapport).filter(Rapport.id == id).first()
    if rapport:
        rapport.valide = True
        db.commit()
        return {"message": "Rapport validé"}
    return {"message": "Rapport introuvable"}

@router.post("/", response_model=RapportOut)
def create_rapport(rapport: RapportCreate, db: Session = Depends(get_db)):
    nouveau = Rapport(**rapport.dict())
    db.add(nouveau)
    db.commit()
    db.refresh(nouveau)
    return nouveau

