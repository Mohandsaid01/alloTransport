from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

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

class UserUpdate(BaseModel):
    prenom: str
    nom: str
    email: str

class IncidentCreate(BaseModel):
    type_incident: str
    ligne: str
    station: str
    description: str
    gravite: str
    email: Optional[str] = None
    contact_souhaite: Optional[str] = None

class IncidentResponse(BaseModel):
    id: int
    type_incident: str
    ligne: str
    station: str
    description: str
    gravite: str
    email: Optional[str] = None
    contact_souhaite: Optional[str] = None
    statut: str
    date_created: datetime

    class Config:
        orm_mode = True
