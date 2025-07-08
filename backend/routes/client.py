from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, UserUpdate  # <-- on va le définir plus bas

router = APIRouter(prefix="/api/clients", tags=["clients"])

# Route pour obtenir les clients
@router.get("/", response_model=list[UserResponse])
def get_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "client").offset(skip).limit(limit).all()

# ✅ Route pour modifier un client
@router.put("/{client_id}", response_model=UserResponse)
def update_client(client_id: int, update_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id, User.role == "client").first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    user.nom = update_data.nom
    user.prenom = update_data.prenom
    user.email = update_data.email
    db.commit()
    db.refresh(user)
    return user

# ✅ Route pour supprimer un client
@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id, User.role == "client").first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprimé avec succès"}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserResponse, UserUpdate  # <-- on va le définir plus bas

router = APIRouter(prefix="/api/clients", tags=["clients"])

# Route pour obtenir les clients
@router.get("/", response_model=list[UserResponse])
def get_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "client").offset(skip).limit(limit).all()

# ✅ Route pour modifier un client
@router.put("/{client_id}", response_model=UserResponse)
def update_client(client_id: int, update_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id, User.role == "client").first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    user.nom = update_data.nom
    user.prenom = update_data.prenom
    user.email = update_data.email
    db.commit()
    db.refresh(user)
    return user

# ✅ Route pour supprimer un client
@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id, User.role == "client").first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprimé avec succès"}
