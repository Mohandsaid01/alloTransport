from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models

# Import des routers
from routes.client import router as client_router
from routes.agent import router as agent_router
from routes.rapport import router as rapport_router
from routes.incidents import router as incidents_router
import auth

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Création des tables si elles n'existent pas encore
Base.metadata.create_all(bind=engine)

# Ajout des routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(client_router)
app.include_router(agent_router)
app.include_router(rapport_router)
app.include_router(incidents_router)  # ✅ CORRECTION NOM DE ROUTEUR
