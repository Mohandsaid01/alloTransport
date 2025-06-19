# create_admin.py

from database import SessionLocal
from models import User
from passlib.hash import bcrypt

# Connexion à la DB
db = SessionLocal()

# Vérifier si un admin existe déjà
existing_admin = db.query(User).filter(User.role == "admin").first()
if existing_admin:
    print(" Un administrateur existe déjà.")
else:
    # Créer un nouvel admin
    new_admin = User(
        prenom="Admin",
        nom="Principal",
        email="admin@stm.ca",
        mot_de_passe=bcrypt.hash("admin123"),
        carte_opus="0000000000",
        role="admin"
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    print("✅ Administrateur créé avec succès :", new_admin.email)

# Fermer la session
db.close()
