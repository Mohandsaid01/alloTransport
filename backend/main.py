from fastapi import FastAPI
from database import Base, engine
from models import User
import auth
import models  # C’est ici qu’on force la création de toutes les tables
from routes.rapport import router as rapport_router
from routes.agent import router as agent_router
from routes.client import router as client_router


from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])


app.include_router(rapport_router)

Base.metadata.create_all(bind=engine)

app.include_router(agent_router)
app.include_router(client_router)
