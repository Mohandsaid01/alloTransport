from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse

router = APIRouter(prefix="/api/clients", tags=["clients"])

@router.get("/", response_model=list[UserResponse])
def get_clients(skip: int = 0, limit: int = 5, db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "client").offset(skip).limit(limit).all()
