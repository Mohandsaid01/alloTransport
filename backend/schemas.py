from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    prenom: str
    nom: str
    email: EmailStr
    mot_de_passe: str
    carte_opus: Optional[str] = None
    role: str = "client" 


class UserLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str

class UserResponse(BaseModel):
    id: int
    prenom: str
    nom: str
    email: EmailStr
    carte_opus: Optional[str]
    role: str  

class RapportCreate(BaseModel):
    titre: str
    contenu: str

class RapportOut(BaseModel):
    id: int
    titre: str
    contenu: str
    valide: bool


    class Config:
        orm_mode = True
