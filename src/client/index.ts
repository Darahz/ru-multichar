import { cache, sleep } from '@overextended/ox_lib/client';
import { Character, NewCharacter } from '@overextended/ox_core';

const SPAWN_LOCATION = JSON.parse(GetConvar('ox:spawnLocation', "[-258.211, -293.077, 21.6132, 206.0]"));

onNet('ox:startCharacterSelect', async (_userId: number, characters: Character[]) => {

  SwitchToMultiFirstpart(PlayerPedId(), 1, 1);

  while (GetPlayerSwitchState() !== 5) await sleep(0);

  DoScreenFadeIn(200);

  /* Code taken from ox_core/src/client/spawn.ts */
  const character = characters[1];
  const [x, y, z] = [
    character?.x || SPAWN_LOCATION[0],
    character?.y || SPAWN_LOCATION[1],
    character?.z || SPAWN_LOCATION[2],
  ];
  const heading = character?.heading || SPAWN_LOCATION[3];

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
        page: 'identity'
      },
    });

    return
  }

  SwitchInPlayer(PlayerPedId());
  SetGameplayCamRelativeHeading(0);

  emitNet('ox:setActiveCharacter', character.charId);
});

interface newCharacterData {
  firstName: string;
  lastName: string;
  gender: string;
  date: number;
}

RegisterNuiCallback('mps-multichar', (data: newCharacterData, cb: (data: unknown) => void) => {

  SwitchInPlayer(PlayerPedId());
  SetGameplayCamRelativeHeading(0);

  SetNuiFocus(false, false);

  SendNUIMessage({
    action: 'setVisible',
    data: {
      visible: false
    },
  });

  emitNet('ox:setActiveCharacter', <NewCharacter>data);

  cb(true);
});