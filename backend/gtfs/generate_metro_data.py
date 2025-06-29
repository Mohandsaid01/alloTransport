import csv
import json
import os
from collections import defaultdict

GTFS_PATH = "."  # dans /gtfs/
OUTPUT_STOPS = "../../public/data/stops_par_ligne"
OUTPUT_TIMES = "../../public/data/horaires_par_arret"

os.makedirs(OUTPUT_STOPS, exist_ok=True)
os.makedirs(OUTPUT_TIMES, exist_ok=True)

# 1. Charger stops.txt
stops = {}
with open("stops.txt", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        stops[row["stop_id"]] = row["stop_name"]

# 2. Charger uniquement les lignes de métro
metro_route_ids = set()
with open("routes.txt", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if row["route_type"] == "1":  # métro
            metro_route_ids.add(row["route_id"])

# 3. Charger trips
trips_by_route = defaultdict(lambda: defaultdict(list))
trip_to_direction = {}

with open("trips.txt", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if row["route_id"] not in metro_route_ids:
            continue
        route_id = row["route_id"]
        headsign = row["trip_headsign"]
        trip_id = row["trip_id"]
        trips_by_route[route_id][headsign].append(trip_id)
        trip_to_direction[trip_id] = headsign

# 4. stop_times → arrêts et horaires
stops_par_ligne = defaultdict(lambda: defaultdict(list))
horaires_par_arret = defaultdict(set)

with open("stop_times.txt", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        trip_id = row["trip_id"]
        stop_id = row["stop_id"]
        heure = row["departure_time"]

        if trip_id not in trip_to_direction:
            continue

        direction = trip_to_direction[trip_id]
        route_id = None
        for rid, dirs in trips_by_route.items():
            if direction in dirs and trip_id in dirs[direction]:
                route_id = rid
                break
        if route_id is None:
            continue

        stops_par_ligne[route_id][direction].append({
            "stop_id": stop_id,
            "stop_name": stops.get(stop_id, stop_id)
        })

        horaires_par_arret[stop_id].add(heure)

# 5. Écrire arrêts
for route_id, directions in stops_par_ligne.items():
    output = []
    for direction, arrets in directions.items():
        seen = set()
        unique_arrets = []
        for a in arrets:
            if a["stop_id"] not in seen:
                seen.add(a["stop_id"])
                unique_arrets.append(a)

        output.append({
            "direction": direction,
            "arrets": unique_arrets
        })

    with open(os.path.join(OUTPUT_STOPS, f"{route_id}.json"), "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

# 6. Écrire horaires
for stop_id, heures in horaires_par_arret.items():
    sorted_heures = sorted(list(heures))
    with open(os.path.join(OUTPUT_TIMES, f"{stop_id}.json"), "w", encoding="utf-8") as f:
        json.dump(sorted_heures, f, ensure_ascii=False, indent=2)

print("✅ Données métro générées.")
