from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models

# Import des routers
from routes.client import router as client_router
from routes.agent import router as agent_router
from routes.rapport import router as rapport_router
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

# Création des tables
Base.metadata.create_all(bind=engine)

# Ajout des routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(client_router)   # <== très important
app.include_router(agent_router)    # <== très important
app.include_router(rapport_router)  # <== très important
