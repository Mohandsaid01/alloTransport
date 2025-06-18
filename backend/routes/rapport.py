from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import RapportCreate, RapportOut

from typing import List

router = APIRouter()

@router.get("/rapports", response_model=List[RapportOut])
def get_rapports(db: Session = Depends(get_db)):
    return db.query(Rapport).all()

@router.post("/rapports/{id}/valider")
def valider_rapport(id: int, db: Session = Depends(get_db)):
    rapport = db.query(Rapport).filter(Rapport.id == id).first()
    if rapport:
        rapport.valide = True
        db.commit()
        return {"message": "Rapport validé"}
    return {"message": "Rapport introuvable"}
