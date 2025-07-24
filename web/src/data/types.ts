export interface Location {
  id: number;
  name: string;
  description: string;
  image: string;
  coords: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
}

export interface SpawnLocations {
  hotels: Location[];
  apartments: Location[];
}
