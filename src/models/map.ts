export interface Location {
  id: number
  name: string;
  description: string;
  x: number;
  y: number;
}

export interface Map {
  locations: Location[];
  adjacencyMatrix: number[][];
}
