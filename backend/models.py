from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

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

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    type_incident = Column(String(100), nullable=False)
    ligne = Column(String(100), nullable=False)
    station = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    gravite = Column(String(20), nullable=False)
    contact_souhaite = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    statut = Column(String(20), default="En attente")
    date_created = Column(DateTime, default=datetime.utcnow)
