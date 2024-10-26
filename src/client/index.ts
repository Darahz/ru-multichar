import { cache, sleep } from '@overextended/ox_lib/client';
import { Character, NewCharacter } from '@overextended/ox_core'

onNet('ox:startCharacterSelect', async (_userId: number, characters: Character[]) => {
  
  SwitchOutPlayer(cache.ped, 1 | 8192, 1);

  while (GetPlayerSwitchState() !== 5) await sleep(0);

  DoScreenFadeIn(200);

  const character = characters[0];
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
});

interface newCharacterData {
  firstName: string;
  lastName: string;
  gender: string;
  date: number;
}

RegisterNuiCallback('mps-multichar', (data: newCharacterData, cb: (data: unknown) => void) => {

  cb(true);

  SetNuiFocus(false, false);

  SendNUIMessage({
    action: 'setVisible',
    data: {
      visible: false
    },
  });

  emitNet('ox:setActiveCharacter', <NewCharacter>data);
});