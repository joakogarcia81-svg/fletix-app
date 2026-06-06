export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  province?: string;
}

export interface TruckProfile {
  id: string;
  type: string; // e.g. Sider, Chasis, Tolva
  capacity_kg: number;
  home_base?: Location; // To calculate return trips
}

export interface TripOpportunity {
  id: string;
  origin: Location;
  destination: Location;
  cargo_type: string;
  weight_kg: number;
  price_ars?: number;
  company_name?: string;
}

export interface MatchResult {
  trip: TripOpportunity;
  score: number; // 0-100
  reasons: string[];
  badges: string[];
  distance_to_origin_km: number;
}

// Haversine formula to calculate distance in km
function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class MatchingEngine {
  // Weights (Future ML models can adjust these dynamically)
  private readonly WEIGHTS = {
    distance: 0.35,
    capacity: 0.30,
    truck_type: 0.20,
    return_trip: 0.15,
  };

  /**
   * Evaluates a single trip against a truck's profile and current location
   */
  public evaluateTrip(
    trip: TripOpportunity,
    truck: TruckProfile,
    currentLocation: Location
  ): MatchResult {
    let score = 0;
    const reasons: string[] = [];
    const badges: string[] = [];

    // 1. Distance to origin (Proximity)
    const distanceToOrigin = calculateDistance(currentLocation, trip.origin);
    if (distanceToOrigin < 20) {
      score += 100 * this.WEIGHTS.distance;
      reasons.push("Carga muy cerca de tu ubicación actual.");
      badges.push("Cerca de ti");
    } else if (distanceToOrigin < 100) {
      score += 70 * this.WEIGHTS.distance;
      reasons.push(`A ${Math.round(distanceToOrigin)} km de ti.`);
    } else if (distanceToOrigin < 300) {
      score += 30 * this.WEIGHTS.distance;
    } // Over 300km gets 0 points for proximity

    // 2. Capacity Check (Weight)
    // If it exceeds capacity, immediate rejection or huge penalty.
    if (trip.weight_kg > truck.capacity_kg) {
      return { trip, score: 0, reasons: ["Excede la capacidad de tu camión."], badges: [], distance_to_origin_km: distanceToOrigin };
    }
    
    // If it's a good fill (over 70% of capacity), reward it (Avoid empty space)
    const fillRatio = trip.weight_kg / truck.capacity_kg;
    if (fillRatio > 0.7) {
      score += 100 * this.WEIGHTS.capacity;
      reasons.push("Carga optimizada para tu capacidad.");
    } else {
      score += (fillRatio * 100) * this.WEIGHTS.capacity;
      reasons.push("Carga parcial (espacio sobrante).");
    }

    // 3. Truck Type Match (Simplified: assuming some types match certain cargo)
    // In a real app, you'd map truck types to allowed cargo types.
    // For MVP, we assume 100% match if not rejected, but in real life we'd check compatibility.
    // Let's pretend some basic logic:
    const requiresRefrigeration = trip.cargo_type.toLowerCase().includes('congelado') || trip.cargo_type.toLowerCase().includes('frío');
    const isRefrigerated = truck.type.toLowerCase().includes('sider') || truck.type.toLowerCase().includes('furgon'); // Simplified logic
    if (requiresRefrigeration && !isRefrigerated) {
       return { trip, score: 0, reasons: ["Requiere equipo de frío."], badges: [], distance_to_origin_km: distanceToOrigin };
    } else {
      score += 100 * this.WEIGHTS.truck_type; // Good match
    }

    // 4. Return Trip (Smart Return)
    if (truck.home_base) {
      const distanceDestToHome = calculateDistance(trip.destination, truck.home_base);
      if (distanceDestToHome < 50) {
        score += 100 * this.WEIGHTS.return_trip;
        reasons.push("Te deja cerca de tu base.");
        badges.push("Retorno Inteligente");
      } else if (distanceDestToHome < 150) {
        score += 50 * this.WEIGHTS.return_trip;
      }
    }

    return {
      trip,
      score: Math.round(score),
      reasons,
      badges,
      distance_to_origin_km: Math.round(distanceToOrigin)
    };
  }

  /**
   * Ranks a list of trips for a specific driver
   */
  public getRecommendations(
    trips: TripOpportunity[],
    truck: TruckProfile,
    currentLocation: Location
  ): MatchResult[] {
    const results = trips.map(trip => this.evaluateTrip(trip, truck, currentLocation));
    
    // Sort descending by score, filter out 0 scores
    return results
      .filter(res => res.score > 20) // Only recommend if score > 20
      .sort((a, b) => b.score - a.score);
  }
}
