import { cache, sleep } from '@communityox/ox_lib/client';
import { Character, NewCharacter } from '@communityox/ox_core';

const SPAWN_LOCATION = JSON.parse(GetConvar('ox:spawnLocation', '[-258.211, -293.077, 21.6132, 206.0]')) as [
  number,
  number,
  number,
  number,
];
const CHARACTER_SLOTS: number = GetConvarInt('ox:characterSlots', 1);

let uiLoaded: boolean = false;

// Handle NUI event for requesting spawn locations
RegisterNuiCallback('mps-multichar:getSpawnLocations', async () => {
  emitNet('mps-multichar:getSpawnLocations');
  return { ok: true };
});

// Forward spawn locations from server to NUI
onNet('mps-multichar:receiveSpawnLocations', (spawnLocations: any) => {
  SendNUIMessage({
    action: 'mps-multichar:receiveSpawnLocations',
    data: spawnLocations,
  });
});

onNet('ox:startCharacterSelect', async (_userId: number, characters: Character[]) => {
  while (!uiLoaded) await sleep(5);

  SendNUIMessage({
    action: 'setData',
    data: {
      characters: characters,
    },
  });

  await sleep(500);

  SwitchToMultiFirstpart(PlayerPedId(), 1, 1);

  while (GetPlayerSwitchState() !== 5) await sleep(0);

  DoScreenFadeIn(200);

  /* Code taken from ox_core/src/client/spawn.ts */
  const character = characters[0];
  const [x, y, z]: number[] = [SPAWN_LOCATION[0], SPAWN_LOCATION[1], SPAWN_LOCATION[2]];
  const heading = SPAWN_LOCATION[3];

  RequestCollisionAtCoord(x, y, z);
  FreezeEntityPosition(cache.ped, true);
  SetEntityCoordsNoOffset(cache.ped, x, y, z, true, true, false);
  SetEntityHeading(cache.ped, heading);

  if (!character) {
    SetNuiFocus(true, true);

    SendNUIMessage({
      action: 'setVisible',
      data: {
        visible: true,
        page: 'identity',
      },
    });

    return;
  }

  SetNuiFocus(true, true);

  SendNUIMessage({
    action: 'setVisible',
    data: {
      visible: true,
      page: 'multichar',
    },
  });

  // emitNet('ox:setActiveCharacter', characters[0].charId);
});

RegisterNuiCallback('mps-multichar:setConfig', (data: boolean, cb: (data: unknown) => void) => {
  uiLoaded = data;
  cb({
    maxSlots: CHARACTER_SLOTS,
  });
});

RegisterNuiCallback('mps-multichar:registerIdentity', (data: NewCharacter, cb: (data: unknown) => void) => {
  SwitchInPlayer(PlayerPedId());
  SetGameplayCamRelativeHeading(0);

  SetNuiFocus(false, false);

  SendNUIMessage({
    action: 'setVisible',
    data: {
      visible: false,
    },
  });

  emitNet('ox:setActiveCharacter', data);

  cb(true);
});

interface SpawnData {
  character: Character;
  coords?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
}

RegisterNuiCallback('mps-multichar:selectedCharacter', (data: SpawnData, cb: (data: unknown) => void) => {
  const { character, coords } = data;
  
  const [x, y, z] = coords ? 
    [coords.x, coords.y, coords.z] : 
    [
      character?.x || SPAWN_LOCATION[0],
      character?.y || SPAWN_LOCATION[1],
      character?.z || SPAWN_LOCATION[2],
    ];
  const heading = coords ? coords.w : character?.heading || SPAWN_LOCATION[3];

  RequestCollisionAtCoord(x, y, z);
  FreezeEntityPosition(cache.ped, true);
  SetEntityCoordsNoOffset(cache.ped, x, y, z, true, true, false);
  SetEntityHeading(cache.ped, heading);

  SwitchInPlayer(PlayerPedId());
  SetGameplayCamRelativeHeading(0);

  SetNuiFocus(false, false);

  SendNUIMessage({
    action: 'setVisible',
    data: {
      visible: false,
    },
  });

  emitNet('ox:setActiveCharacter', character.charId);

  cb(true);
});
