import csv
import json
import os

# Dossier GTFS et sortie
GTFS_PATH = "gtfs"
OUTPUT_DIR = "../frontend/public/data"  # adapte selon ton projet React

# Assure que le dossier de sortie existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

bus_routes = []
metro_routes = []

# Lire routes.txt
with open(os.path.join(GTFS_PATH, "routes.txt"), encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        route = {
            "route_id": row["route_id"],
            "route_short_name": row["route_short_name"],
            "route_long_name": row["route_long_name"]
        }

        route_type = row.get("route_type", "")
        # STM : 0 = Tram, 1 = Métro, 3 = Bus
        if route_type == "3":
            bus_routes.append(route)
        elif route_type == "1":
            metro_routes.append(route)

# Sauver les fichiers JSON
with open(os.path.join(OUTPUT_DIR, "bus_routes.json"), "w", encoding="utf-8") as f:
    json.dump(bus_routes, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "metro_routes.json"), "w", encoding="utf-8") as f:
    json.dump(metro_routes, f, ensure_ascii=False, indent=2)

print("✅ Fichiers générés : bus_routes.json et metro_routes.json")
