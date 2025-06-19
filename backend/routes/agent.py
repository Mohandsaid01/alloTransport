from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse

router = APIRouter(prefix="/api/agents", tags=["agents"])

@router.get("/", response_model=list[UserResponse])
def get_agents(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "agent").all()
