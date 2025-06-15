// Service API STM - Version avec vraies données protobuf
import protobuf from 'protobufjs';

class STMApiService {
  constructor() {
    this.apiKey = 'l7f11d70fdf15b4ee680a1de4e0100bf93';
    this.clientSecret = '817ca38883424fa197bc46c22a6fabff';
    
    // URLs officielles STM
    this.serviceBaseUrl = 'https://api.stm.info/pub/od/i3/v2/messages';
    this.gtfsBaseUrl = 'https://api.stm.info/pub/od/gtfs-rt/ic/v2';
    
    // Initialiser le protobuf GTFS-RT
    this.initProtobuf();
  }

  // Initialiser les définitions protobuf GTFS-RT avec la méthode correcte
  async initProtobuf() {
    try {
      // Définition protobuf GTFS-RT officielle (Version 2.0)
      const gtfsRtProtoString = `
        syntax = "proto2";
        package transit_realtime;
        
        message FeedMessage {
          required FeedHeader header = 1;
          repeated FeedEntity entity = 2;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message FeedHeader {
          required string gtfs_realtime_version = 1;
          enum Incrementality {
            FULL_DATASET = 0;
            DIFFERENTIAL = 1;
          }
          optional Incrementality incrementality = 2 [default = FULL_DATASET];
          optional uint64 timestamp = 3;
          optional string feed_version = 4;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message FeedEntity {
          required string id = 1;
          optional bool is_deleted = 2 [default = false];
          optional TripUpdate trip_update = 3;
          optional VehiclePosition vehicle = 4;
          optional Alert alert = 5;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message TripUpdate {
          required TripDescriptor trip = 1;
          optional VehicleDescriptor vehicle = 3;
          repeated StopTimeUpdate stop_time_update = 2;
          optional uint64 timestamp = 4;
          optional int32 delay = 5;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message StopTimeUpdate {
          optional uint32 stop_sequence = 1;
          optional string stop_id = 4;
          optional StopTimeEvent arrival = 2;
          optional StopTimeEvent departure = 3;
          enum ScheduleRelationship {
            SCHEDULED = 0;
            SKIPPED = 1;
            NO_DATA = 2;
            UNSCHEDULED = 3;
          }
          optional ScheduleRelationship schedule_relationship = 5 [default = SCHEDULED];
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message StopTimeEvent {
          optional int32 delay = 1;
          optional int64 time = 2;
          optional int32 uncertainty = 3;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message VehiclePosition {
          optional TripDescriptor trip = 1;
          optional VehicleDescriptor vehicle = 8;
          optional Position position = 2;
          optional uint32 current_stop_sequence = 3;
          optional string stop_id = 7;
          enum VehicleStopStatus {
            INCOMING_AT = 0;
            STOPPED_AT = 1;
            IN_TRANSIT_TO = 2;
          }
          optional VehicleStopStatus current_status = 4 [default = IN_TRANSIT_TO];
          optional uint64 timestamp = 5;
          enum CongestionLevel {
            UNKNOWN_CONGESTION_LEVEL = 0;
            RUNNING_SMOOTHLY = 1;
            STOP_AND_GO = 2;
            CONGESTION = 3;
            SEVERE_CONGESTION = 4;
          }
          optional CongestionLevel congestion_level = 6;
          enum OccupancyStatus {
            EMPTY = 0;
            MANY_SEATS_AVAILABLE = 1;
            FEW_SEATS_AVAILABLE = 2;
            STANDING_ROOM_ONLY = 3;
            CRUSHED_STANDING_ROOM_ONLY = 4;
            FULL = 5;
            NOT_ACCEPTING_PASSENGERS = 6;
            NO_DATA_AVAILABLE = 7;
            NOT_BOARDABLE = 8;
          }
          optional OccupancyStatus occupancy_status = 9;
          optional uint32 occupancy_percentage = 10;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message TripDescriptor {
          optional string trip_id = 1;
          optional string route_id = 5;
          optional uint32 direction_id = 6;
          optional string start_time = 2;
          optional string start_date = 3;
          enum ScheduleRelationship {
            SCHEDULED = 0;
            ADDED = 1;
            UNSCHEDULED = 2;
            CANCELED = 3;
            REPLACEMENT = 5;
            DUPLICATED = 6;
            DELETED = 7;
          }
          optional ScheduleRelationship schedule_relationship = 4;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message VehicleDescriptor {
          optional string id = 1;
          optional string label = 2;
          optional string license_plate = 3;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message Position {
          required float latitude = 1;
          required float longitude = 2;
          optional float bearing = 3;
          optional double odometer = 4;
          optional float speed = 5;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message Alert {
          repeated TimeRange active_period = 1;
          repeated EntitySelector informed_entity = 5;
          enum Cause {
            UNKNOWN_CAUSE = 1;
            OTHER_CAUSE = 2;
            TECHNICAL_PROBLEM = 3;
            STRIKE = 4;
            DEMONSTRATION = 5;
            ACCIDENT = 6;
            HOLIDAY = 7;
            WEATHER = 8;
            MAINTENANCE = 9;
            CONSTRUCTION = 10;
            POLICE_ACTIVITY = 11;
            MEDICAL_EMERGENCY = 12;
          }
          optional Cause cause = 6 [default = UNKNOWN_CAUSE];
          enum Effect {
            NO_SERVICE = 1;
            REDUCED_SERVICE = 2;
            SIGNIFICANT_DELAYS = 3;
            DETOUR = 4;
            ADDITIONAL_SERVICE = 5;
            MODIFIED_SERVICE = 6;
            OTHER_EFFECT = 7;
            UNKNOWN_EFFECT = 8;
            STOP_MOVED = 9;
            NO_EFFECT = 10;
            ACCESSIBILITY_ISSUE = 11;
          }
          optional Effect effect = 7 [default = UNKNOWN_EFFECT];
          optional TranslatedString url = 8;
          optional TranslatedString header_text = 10;
          optional TranslatedString description_text = 11;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message TimeRange {
          optional uint64 start = 1;
          optional uint64 end = 2;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message EntitySelector {
          optional string agency_id = 1;
          optional string route_id = 2;
          optional int32 route_type = 3;
          optional TripDescriptor trip = 4;
          optional string stop_id = 5;
          optional uint32 direction_id = 6;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
        
        message TranslatedString {
          message Translation {
            required string text = 1;
            optional string language = 2;
            extensions 1000 to 1999;
            extensions 9000 to 9999;
          }
          repeated Translation translation = 1;
          extensions 1000 to 1999;
          extensions 9000 to 9999;
        }
      `;
      
      // Charger le protobuf avec la méthode correcte selon la documentation
      this.root = await protobuf.parse(gtfsRtProtoString).root;
      this.FeedMessage = this.root.lookupType("transit_realtime.FeedMessage");
      
      console.log('✅ Protobuf GTFS-RT initialisé avec succès');
      console.log('📋 Types disponibles:', Object.keys(this.root.nestedArray));
      
    } catch (error) {
      console.error('❌ Erreur initialisation protobuf:', error);
      this.root = null;
      this.FeedMessage = null;
    }
  }

  // Méthode pour appeler l'état du service (JSON)
  async getServiceStatus() {
    try {
      const url = `${this.serviceBaseUrl}/etatservice`;
      
      console.log('🔄 Appel API STM État du service:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.apiKey,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('📡 État du service - Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur état du service:', errorText);
        throw new Error(`Erreur STM ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Données état du service reçues:', data);
      
      return this.formatServiceStatus(data);
    } catch (error) {
      console.error('❌ Erreur API STM État du service:', error);
      throw error;
    }
  }

  // Méthode pour décoder les positions véhicules avec la méthode correcte
  async getVehiclePositions() {
    try {
      const url = `${this.gtfsBaseUrl}/vehiclePositions`;
      
      console.log('🔄 Appel API STM Positions véhicules:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.apiKey,
          'Accept': 'application/x-protobuf',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('📡 Positions véhicules - Status:', response.status, response.statusText);
      console.log('📋 Content-Type:', response.headers.get('content-type'));
      console.log('📋 Content-Length:', response.headers.get('content-length'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur positions véhicules:', errorText);
        throw new Error(`Erreur STM ${response.status}: ${response.statusText}`);
      }

      // Lire les données protobuf comme ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      const dataSize = arrayBuffer.byteLength;
      console.log(`📦 Taille des données reçues: ${dataSize} bytes`);

      if (dataSize === 0) {
        console.warn('⚠️ Aucune donnée reçue de l\'API');
        return this.formatVehiclePositionsEmpty();
      }

      // Convertir en Uint8Array pour protobufjs
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log('🔍 Premiers 20 bytes:', Array.from(uint8Array.slice(0, 20)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));

      // Décoder avec protobufjs - méthode correcte selon la documentation
      if (this.FeedMessage) {
        try {
          console.log('🔄 Décodage protobuf avec FeedMessage.decode()...');
          
          // Méthode de décodage recommandée pour protobufjs
          const feedMessage = this.FeedMessage.decode(uint8Array);
          
          console.log('✅ Décodage protobuf réussi!');
          console.log('📊 Entités trouvées:', feedMessage.entity ? feedMessage.entity.length : 0);
          console.log('📋 Version GTFS-RT:', feedMessage.header?.gtfs_realtime_version);
          console.log('⏰ Timestamp feed:', feedMessage.header?.timestamp);
          
          return this.formatVehiclePositions(feedMessage);
          
        } catch (decodeError) {
          console.error('❌ Erreur décodage protobuf:', decodeError);
          console.log('🔍 Type d\'erreur:', decodeError.constructor.name);
          console.log('🔍 Message d\'erreur:', decodeError.message);
          
          // Essayer de décoder partiellement pour diagnostic
          try {
            console.log('🔄 Tentative de diagnostic des données...');
            this.diagnoseBinaryData(uint8Array);
          } catch (diagError) {
            console.error('❌ Erreur diagnostic:', diagError);
          }
          
          return this.formatVehiclePositionsRaw(uint8Array, decodeError.message);
        }
      } else {
        console.error('❌ FeedMessage non initialisé');
        return this.formatVehiclePositionsRaw(uint8Array, 'Protobuf non initialisé');
      }

    } catch (error) {
      console.error('❌ Erreur API STM Positions:', error);
      throw error;
    }
  }

  // Méthode pour décoder les trip updates
  async getTripUpdates() {
    try {
      const url = `${this.gtfsBaseUrl}/tripUpdates`;
      
      console.log('🔄 Appel API STM Trip Updates:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': this.apiKey,
          'Accept': 'application/x-protobuf',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('📡 Trip Updates - Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur trip updates:', errorText);
        throw new Error(`Erreur STM ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const dataSize = arrayBuffer.byteLength;
      console.log(`📦 Taille trip updates: ${dataSize} bytes`);

      if (dataSize === 0) {
        console.warn('⚠️ Aucune donnée trip updates reçue');
        return this.formatTripUpdatesEmpty();
      }

      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Décoder avec protobufjs
      if (this.FeedMessage) {
        try {
          console.log('🔄 Décodage trip updates...');
          const feedMessage = this.FeedMessage.decode(uint8Array);
          console.log('✅ Décodage trip updates réussi!');
          console.log('📊 Entités trip updates:', feedMessage.entity ? feedMessage.entity.length : 0);
          
          return this.formatTripUpdates(feedMessage);
          
        } catch (decodeError) {
          console.error('❌ Erreur décodage trip updates:', decodeError);
          return this.formatTripUpdatesRaw(uint8Array, decodeError.message);
        }
      } else {
        console.error('❌ FeedMessage non initialisé pour trip updates');
        return this.formatTripUpdatesRaw(uint8Array, 'Protobuf non initialisé');
      }

    } catch (error) {
      console.error('❌ Erreur API STM Trip Updates:', error);
      throw error;
    }
  }

  // Diagnostic des données binaires
  diagnoseBinaryData(uint8Array) {
    console.log('🔍 === DIAGNOSTIC DES DONNÉES BINAIRES ===');
    console.log('📏 Taille totale:', uint8Array.length, 'bytes');
    
    // Analyser les premiers bytes pour voir la structure
    if (uint8Array.length >= 10) {
      console.log('🔍 Analyse des premiers bytes:');
      for (let i = 0; i < Math.min(10, uint8Array.length); i++) {
        const byte = uint8Array[i];
        const binary = byte.toString(2).padStart(8, '0');
        const char = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
        console.log(`  Byte ${i}: 0x${byte.toString(16).padStart(2, '0')} (${byte}) ${binary} '${char}'`);
      }
    }
    
    // Vérifier si les données commencent par un header protobuf valide
    if (uint8Array.length >= 2) {
      const firstField = uint8Array[0];
      const wireType = firstField & 0x07;
      const fieldNumber = firstField >> 3;
      console.log(`🔍 Premier champ - Field: ${fieldNumber}, Wire type: ${wireType}`);
    }
  }

  // Formater l'état du service
  formatServiceStatus(data) {
    return {
      status: this.determineStatus(data),
      activeAlerts: Array.isArray(data) ? data.length : 0,
      criticalAlerts: Array.isArray(data) ? data.filter(a => a.priority === 'HIGH' || a.severity === 'HIGH').length : 0,
      lastUpdate: new Date().toISOString(),
      alerts: Array.isArray(data) ? data : [],
      rawData: data
    };
  }

  // Déterminer le statut global
  determineStatus(data) {
    if (Array.isArray(data) && data.length > 0) {
      const hasCritical = data.some(a => 
        a.priority === 'HIGH' || 
        a.severity === 'HIGH' ||
        a.effect === 'NO_SERVICE'
      );
      return hasCritical ? 'Critique' : 'Perturbé';
    }
    return 'Normal';
  }

  // Formater les positions décodées avec plus de détails
  formatVehiclePositions(feedMessage) {
    const vehicles = [];
    
    if (feedMessage.entity && Array.isArray(feedMessage.entity)) {
      console.log(`📊 Traitement de ${feedMessage.entity.length} entités...`);
      
      feedMessage.entity.forEach((entity, index) => {
        if (entity.vehicle) {
          const vehicle = entity.vehicle;
          
          // Log pour les premières entités pour diagnostic
          if (index < 3) {
            console.log(`🚌 Véhicule ${index}:`, {
              id: entity.id,
              vehicleId: vehicle.vehicle?.id,
              routeId: vehicle.trip?.route_id,
              position: vehicle.position
            });
          }
          
          vehicles.push({
            id: entity.id,
            vehicleId: vehicle.vehicle?.id || vehicle.vehicle?.label || 'Inconnu',
            routeId: vehicle.trip?.route_id || 'Inconnu',
            tripId: vehicle.trip?.trip_id || null,
            directionId: vehicle.trip?.direction_id || null,
            position: vehicle.position ? {
              latitude: vehicle.position.latitude,
              longitude: vehicle.position.longitude,
              bearing: vehicle.position.bearing || null,
              speed: vehicle.position.speed || null
            } : null,
            timestamp: vehicle.timestamp ? new Date(Number(vehicle.timestamp) * 1000) : null,
            status: this.getVehicleStatus(vehicle.current_status),
            congestionLevel: this.getCongestionLevel(vehicle.congestion_level),
            occupancyStatus: this.getOccupancyStatus(vehicle.occupancy_status)
          });
        }
      });
    }
    
    console.log(`✅ ${vehicles.length} véhicules traités avec succès`);
    
    return {
      dataReceived: true,
      dataType: 'protobuf-decoded-real',
      vehicleCount: vehicles.length,
      timestamp: new Date().toISOString(),
      vehicles: vehicles,
      feedInfo: {
        version: feedMessage.header?.gtfs_realtime_version,
        timestamp: feedMessage.header?.timestamp,
        incrementality: feedMessage.header?.incrementality
      }
    };
  }

  // Formater les trip updates décodées
  formatTripUpdates(feedMessage) {
    const trips = [];
    
    if (feedMessage.entity && Array.isArray(feedMessage.entity)) {
      console.log(`📊 Traitement de ${feedMessage.entity.length} entités trip updates...`);
      
      feedMessage.entity.forEach((entity, index) => {
        if (entity.trip_update) {
          const tripUpdate = entity.trip_update;
          
          // Log pour les premières entités pour diagnostic
          if (index < 3) {
            console.log(`🚌 Trip ${index}:`, {
              id: entity.id,
              tripId: tripUpdate.trip?.trip_id,
              routeId: tripUpdate.trip?.route_id,
              delay: tripUpdate.delay
            });
          }
          
          trips.push({
            id: entity.id,
            tripId: tripUpdate.trip?.trip_id || null,
            routeId: tripUpdate.trip?.route_id || 'Inconnu',
            directionId: tripUpdate.trip?.direction_id || null,
            vehicleId: tripUpdate.vehicle?.id || tripUpdate.vehicle?.label || null,
            delay: tripUpdate.delay || 0,
            timestamp: tripUpdate.timestamp ? new Date(Number(tripUpdate.timestamp) * 1000) : null,
            stopUpdates: tripUpdate.stop_time_update ? tripUpdate.stop_time_update.map(stop => ({
              stopId: stop.stop_id,
              sequence: stop.stop_sequence,
              arrivalDelay: stop.arrival?.delay || 0,
              arrivalTime: stop.arrival?.time ? new Date(Number(stop.arrival.time) * 1000) : null,
              departureDelay: stop.departure?.delay || 0,
              departureTime: stop.departure?.time ? new Date(Number(stop.departure.time) * 1000) : null,
              scheduleRelationship: this.getScheduleRelationship(stop.schedule_relationship)
            })) : []
          });
        }
      });
    }
    
    console.log(`✅ ${trips.length} trajets traités avec succès`);
    
    return {
      dataReceived: true,
      dataType: 'protobuf-decoded-real',
      tripCount: trips.length,
      timestamp: new Date().toISOString(),
      trips: trips,
      feedInfo: {
        version: feedMessage.header?.gtfs_realtime_version,
        timestamp: feedMessage.header?.timestamp,
        incrementality: feedMessage.header?.incrementality
      }
    };
  }

  // Fallback pour données vides
  formatVehiclePositionsEmpty() {
    return {
      dataReceived: true,
      dataType: 'empty',
      vehicleCount: 0,
      timestamp: new Date().toISOString(),
      message: 'Aucune donnée de position disponible actuellement',
      vehicles: []
    };
  }

  formatTripUpdatesEmpty() {
    return {
      dataReceived: true,
      dataType: 'empty',
      tripCount: 0,
      timestamp: new Date().toISOString(),
      message: 'Aucune mise à jour de trajet disponible actuellement',
      trips: []
    };
  }

  // Fallback pour données brutes non décodées
  formatVehiclePositionsRaw(data, errorMessage) {
    return {
      dataReceived: true,
      dataType: 'protobuf-raw-error',
      dataLength: data.length,
      timestamp: new Date().toISOString(),
      message: `Échec du décodage protobuf: ${errorMessage}`,
      error: errorMessage,
      vehicles: []
    };
  }

  formatTripUpdatesRaw(data, errorMessage) {
    return {
      dataReceived: true,
      dataType: 'protobuf-raw-error',
      dataLength: data.length,
      timestamp: new Date().toISOString(),
      message: `Échec du décodage protobuf: ${errorMessage}`,
      error: errorMessage,
      trips: []
    };
  }

  // Utilitaires pour les enums
  getVehicleStatus(status) {
    const statusMap = {
      0: 'Entrant à l\'arrêt',
      1: 'À l\'arrêt',
      2: 'En transit'
    };
    return statusMap[status] || 'En service';
  }

  getCongestionLevel(level) {
    const levelMap = {
      0: 'Inconnu',
      1: 'Fluide',
      2: 'Stop and Go',
      3: 'Congestion',
      4: 'Congestion sévère'
    };
    return levelMap[level] || null;
  }

  getOccupancyStatus(status) {
    const statusMap = {
      0: 'Vide',
      1: 'Plusieurs sièges disponibles',
      2: 'Peu de sièges disponibles',
      3: 'Debout seulement',
      4: 'Très bondé',
      5: 'Plein',
      6: 'N\'accepte pas de passagers',
      7: 'Aucune donnée',
      8: 'Non accessible'
    };
    return statusMap[status] || null;
  }

  getScheduleRelationship(relationship) {
    const relationshipMap = {
      0: 'Prévu',
      1: 'Sauté',
      2: 'Aucune donnée',
      3: 'Non programmé'
    };
    return relationshipMap[relationship] || 'Prévu';
  }

  // Méthode principale pour obtenir les horaires d'une route
  async getScheduleForRoute(routeId) {
    try {
      console.log(`🔄 Récupération des données pour la route ${routeId}`);
      
      const [serviceStatus, vehicleData, tripData] = await Promise.all([
        this.getServiceStatus(),
        this.getVehiclePositions(),
        this.getTripUpdates()
      ]);

      // Filtrer par route si spécifiée
      if (routeId && vehicleData.vehicles) {
        vehicleData.vehicles = vehicleData.vehicles.filter(v => v.routeId === routeId);
      }
      
      if (routeId && tripData.trips) {
        tripData.trips = tripData.trips.filter(t => t.routeId === routeId);
      }

      return {
        routeId,
        serviceStatus,
        vehicleData,
        tripData,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Erreur pour la route ${routeId}:`, error);
      throw error;
    }
  }

  // Utilitaires
  formatTime(timestamp) {
    if (!timestamp) return 'N/A';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('fr-CA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

export default new STMApiService();