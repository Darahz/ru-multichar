import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load spawn locations from external JSON file
function loadSpawnLocations() {
  try {
    const dataPath = resolve(GetResourcePath(GetCurrentResourceName()), 'data', 'spawnlocations.json');
    const fileContent = readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load spawn locations:', error);
    // Return empty data if file loading fails
    return {
      hotels: [],
      apartments: []
    };
  }
}

// Cache the spawn locations data
let spawnLocationsCache = loadSpawnLocations();

// Reload spawn locations (useful for development or if admins modify the file)
function reloadSpawnLocations() {
  spawnLocationsCache = loadSpawnLocations();
  console.log('Spawn locations reloaded');
  return spawnLocationsCache;
}

// Export function to get spawn locations
onNet('mps-multichar:getSpawnLocations', () => {
  const source = global.source;
  emitNet('mps-multichar:receiveSpawnLocations', source, spawnLocationsCache);
});

// Admin command to reload spawn locations
RegisterCommand('reloadlocations', () => {
  const reloaded = reloadSpawnLocations();
  console.log('Spawn locations reloaded:', reloaded);
}, true); // true = server only

console.log('Multichar server loaded. Spawn locations loaded:', Object.keys(spawnLocationsCache));