/* eslint-disable no-unused-vars */
// src/components/MapComponent.jsx - Google Maps COMPLET avec STM
import React, { useState, useEffect, useRef } from 'react';
import './MapComponent.css';

const MapComponent = ({ 
  departure = '',
  destination = '',
  onRouteCalculated = () => {} 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const GOOGLE_MAPS_API_KEY = "X";

  // Charger Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,directions`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  // Initialiser la carte
  const initializeMap = () => {
    if (mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 45.5017, lng: -73.5673 }, // Montréal
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{ "color": "#0099cc" }]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{ "color": "#0099cc" }]
          }
        ]
      });

      const dirService = new window.google.maps.DirectionsService();
      const dirRenderer = new window.google.maps.DirectionsRenderer({
        draggable: false,
        panel: null,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#0099cc',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      dirRenderer.setMap(googleMap);
      
      setMap(googleMap);
      setDirectionsService(dirService);
      setDirectionsRenderer(dirRenderer);
    }
  };

  // Calculer plusieurs itinéraires comme Google Maps
  const calculateAllRoutes = () => {
    if (!directionsService || !departure || !destination) {
      return;
    }

    setLoading(true);
    setRoutes([]);

    // Requête principale pour transport en commun
    const transitRequest = {
      origin: departure + ', Montreal, QC, Canada',
      destination: destination + ', Montreal, QC, Canada',
      travelMode: window.google.maps.TravelMode.TRANSIT,
      transitOptions: {
        modes: [
          window.google.maps.TransitMode.BUS,
          window.google.maps.TransitMode.SUBWAY,
          window.google.maps.TransitMode.TRAIN
        ],
        routingPreference: window.google.maps.TransitRoutePreference.FEWER_TRANSFERS
      },
      provideRouteAlternatives: true,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      region: 'CA'
    };

    // Calculer les itinéraires
    directionsService.route(transitRequest, (result, status) => {
      if (status === 'OK') {
        const calculatedRoutes = result.routes.map((route, index) => {
          const leg = route.legs[0];
          return {
            id: index,
            summary: route.summary,
            duration: leg.duration.text,
            durationValue: leg.duration.value,
            distance: leg.distance.text,
            departureTime: leg.departure_time?.text || 'Maintenant',
            arrivalTime: leg.arrival_time?.text || '',
            fare: leg.fare?.text || '',
            steps: parseTransitSteps(leg.steps),
            transferCount: countTransfers(leg.steps),
            route: route
          };
        });

        // Trier par durée (plus rapide en premier)
        calculatedRoutes.sort((a, b) => a.durationValue - b.durationValue);
        
        setRoutes(calculatedRoutes);
        setSelectedRouteIndex(0);
        
        // Afficher le premier itinéraire
        if (calculatedRoutes.length > 0) {
          directionsRenderer.setDirections(result);
          directionsRenderer.setRouteIndex(0);
          onRouteCalculated(calculatedRoutes[0]);
        }
      } else {
        console.error('Erreur calcul itinéraire:', status);
        handleDirectionsError(status);
      }
      setLoading(false);
    });
  };

  // Parser les étapes de transport
  const parseTransitSteps = (steps) => {
    return steps.map((step, index) => {
      if (step.travel_mode === 'WALKING') {
        return {
          type: 'walking',
          instructions: step.instructions.replace(/<[^>]*>/g, ''),
          duration: step.duration.text,
          distance: step.distance.text,
          mode: 'WALKING'
        };
      } else if (step.travel_mode === 'TRANSIT') {
        const transit = step.transit;
        const line = transit.line;
        const vehicle = line.vehicle;
        
        return {
          type: 'transit',
          instructions: `Prenez ${getVehicleType(vehicle.type)} ${line.short_name || line.name}`,
          duration: step.duration.text,
          distance: step.distance?.text || '',
          mode: 'TRANSIT',
          transitDetails: {
            line: line.short_name || line.name,
            longName: line.name,
            headsign: transit.headsign,
            departure: {
              stop: transit.departure_stop.name,
              time: transit.departure_time.text
            },
            arrival: {
              stop: transit.arrival_stop.name,
              time: transit.arrival_time.text
            },
            agency: line.agencies[0]?.name || 'STM',
            color: line.color || '#0099cc',
            textColor: line.text_color || '#ffffff',
            vehicle: vehicle.type,
            vehicleIcon: getVehicleIcon(vehicle.type),
            numStops: transit.num_stops
          }
        };
      }
      return null;
    }).filter(Boolean);
  };

  // Compter les correspondances
  const countTransfers = (steps) => {
    let transfers = 0;
    let transitSteps = 0;
    
    steps.forEach(step => {
      if (step.travel_mode === 'TRANSIT') {
        transitSteps++;
        if (transitSteps > 1) {
          transfers++;
        }
      }
    });
    
    return Math.max(0, transfers);
  };

  // Obtenir le type de véhicule en français
  const getVehicleType = (type) => {
    switch(type) {
      case 'SUBWAY': return 'le métro';
      case 'BUS': return 'le bus';
      case 'TRAIN': return 'le train';
      case 'TRAM': return 'le tramway';
      default: return 'le transport';
    }
  };

  // Obtenir l'icône du véhicule
  const getVehicleIcon = (type) => {
    switch(type) {
      case 'SUBWAY': return 'M';
      case 'BUS': return 'B';
      case 'TRAIN': return 'T';
      case 'TRAM': return 'T';
      default: return 'T';
    }
  };

  // Gérer les erreurs de directions
  const handleDirectionsError = (status) => {
    let errorMessage = 'Impossible de calculer l\'itinéraire.';
    switch(status) {
      case 'ZERO_RESULTS':
        errorMessage = 'Aucun itinéraire en transport en commun trouvé entre ces deux points.';
        break;
      case 'NOT_FOUND':
        errorMessage = 'Une des adresses n\'a pas pu être trouvée. Vérifiez l\'orthographe.';
        break;
      case 'OVER_QUERY_LIMIT':
        errorMessage = 'Limite de requêtes atteinte. Veuillez réessayer dans quelques minutes.';
        break;
      case 'REQUEST_DENIED':
        errorMessage = 'Requête refusée. Vérifiez votre connexion internet.';
        break;
      default:
        errorMessage += ` Code d'erreur: ${status}`;
    }
    alert(errorMessage);
  };

  // Sélectionner un itinéraire différent
  const selectRoute = (routeIndex) => {
    if (routes[routeIndex] && directionsRenderer) {
      setSelectedRouteIndex(routeIndex);
      directionsRenderer.setRouteIndex(routeIndex);
      onRouteCalculated(routes[routeIndex]);
    }
  };

  // Déclencher le calcul automatiquement
  useEffect(() => {
    if (departure && destination && directionsService) {
      const timer = setTimeout(() => {
        calculateAllRoutes();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [departure, destination, directionsService]);

  return (
    <div className="enhanced-map-container">
      {/* Carte Google Maps agrandie */}
      <div className="map-wrapper">
        <div 
          ref={mapRef} 
          className="google-map-large"
        />
        
        {loading && (
          <div className="map-loading-overlay">
            <div className="loading-spinner"></div>
            <span>Recherche d'itinéraires STM...</span>
          </div>
        )}
      </div>

      {/* Panel des itinéraires comme Google Maps */}
      {routes.length > 0 && (
        <div className="routes-panel">
          <div className="routes-header">
            <h3>Itinéraires suggérés</h3>
            <span className="routes-count">{routes.length} option{routes.length > 1 ? 's' : ''}</span>
          </div>
          
          <div className="routes-list">
            {routes.map((route, index) => (
              <div 
                key={route.id}
                className={`route-option ${index === selectedRouteIndex ? 'selected' : ''}`}
                onClick={() => selectRoute(index)}
              >
                <div className="route-summary">
                  <div className="route-time">
                    <span className="duration">{route.duration}</span>
                    <span className="time-range">
                      {route.departureTime} - {route.arrivalTime}
                    </span>
                  </div>
                  <div className="route-info">
                    <span className="distance">{route.distance}</span>
                    {route.transferCount > 0 && (
                      <span className="transfers">
                        {route.transferCount} correspondance{route.transferCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {route.fare && (
                      <span className="fare">{route.fare}</span>
                    )}
                  </div>
                </div>
                
                <div className="route-steps-preview">
                  {route.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="step-preview">
                      {step.type === 'walking' ? (
                        <span className="step-walk">Marche {step.duration}</span>
                      ) : (
                        <span 
                          className="step-transit"
                          style={{ 
                            backgroundColor: step.transitDetails.color,
                            color: step.transitDetails.textColor 
                          }}
                        >
                          {step.transitDetails.vehicleIcon} {step.transitDetails.line}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;