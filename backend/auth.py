from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from schemas import UserCreate, UserLogin, UserResponse
from passlib.hash import bcrypt
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    hashed_pw = pwd_context.hash(user.mot_de_passe)
    new_user = User(
        prenom=user.prenom,
        nom=user.nom,
        email=user.email,
        mot_de_passe=hashed_pw,
        carte_opus=user.carte_opus,
        role=user.role  # Assurez-vous que le rôle est défini dans le schéma UserCreate
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.mot_de_passe, user.mot_de_passe):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    return {"message": "Connexion réussie", "user": {
        "id": user.id,
        "prenom": user.prenom,
        "nom": user.nom,
        "email": user.email,
        "carte_opus": user.carte_opus,
        "role": user.role  # Inclure le rôle dans la réponse

        
    }}
