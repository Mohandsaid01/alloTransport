from sqlalchemy import Column, Integer, String, Boolean,  ForeignKey
from sqlalchemy.orm import  relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    prenom = Column(String, nullable=False)
    nom = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mot_de_passe = Column(String, nullable=False)
    carte_opus = Column(String, nullable=True)
    role = Column(String, nullable=False, default="client")  
   




class Rapport(Base):
    __tablename__ = "rapports"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    contenu = Column(String, nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"))
    valide = Column(Boolean, default=False)

