from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models  # Pour forcer la création des tables

from auth import router as auth_router
from routes.rapport import router as rapport_router
from routes.agent import router as agent_router
from routes.client import router as client_router

# Création de l'application FastAPI
app = FastAPI()

# Middleware CORS (pour autoriser le frontend à communiquer)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplace * par ["http://localhost:5173"] en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Création des tables dans la base de données
Base.metadata.create_all(bind=engine)

# Inclusion des routes
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(rapport_router, prefix="/api/rapports", tags=["rapports"])
app.include_router(agent_router, prefix="/api/agents", tags=["agents"])
app.include_router(client_router, prefix="/api/clients", tags=["clients"])
app.include_router(rapport_router)  
