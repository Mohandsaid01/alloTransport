from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/rapports", tags=["rapports"])

# Dépendance pour obtenir une session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.RapportOut)
def create_rapport(rapport: schemas.RapportCreate, db: Session = Depends(get_db)):
    db_rapport = models.Rapport(**rapport.dict())
    db.add(db_rapport)
    db.commit()
    db.refresh(db_rapport)
    return db_rapport

@router.get("/", response_model=list[schemas.RapportOut])
def get_all_rapports(db: Session = Depends(get_db)):
    return db.query(models.Rapport).all()
