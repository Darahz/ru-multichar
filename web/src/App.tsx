import { useEffect, useState } from 'react';
import { isEnvBrowser } from './utils/misc';
import { useNuiEvent } from './hooks/useNuiEvent';
import { fetchNui } from './utils/fetchNui';
import Identity from './pages/Identity';
import DevDrawer from './utils/DevDrawer';
import Multichar from './pages/MultiChar';

import { Character } from '@overextended/ox_core';

function App() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(isEnvBrowser());
  const [page, setPage] = useState<string>('identity');
  const [charSlots, setCharSlots] = useState<number>(1);
  const [characters, setCharacters] = useState<Character[]>([]);

  if (!loaded) {
    fetchNui('mps-multichar:setConfig', true, { data: { maxSlots: 5 } })
      .then((r) => {
        setLoaded(true);
        setCharSlots(r.maxSlots);
      })
      .catch((err) => console.error('Unable to get config', err));
  }

  useNuiEvent('setVisible', (data: { visible?: boolean; page?: string }) => {
    setVisible(data.visible || false);
    if (data.page) setPage(data.page);
  });

  useNuiEvent('setData', (data: { characters?: Character[] }) => {
    if (data.characters) setCharacters(data.characters);
  });

  if (isEnvBrowser()) {
    useEffect(() => {
      setTimeout(() => {
        setCharacters([
          {
            charId: 1,
            stateId: 'IJ0221',
            firstName: 'Maximus',
            lastName: 'Prime',
            x: 411.69232177734375,
            y: -1628.4000244140625,
            z: 29.2799072265625,
            heading: 243.77952575683594,
            lastPlayed: '26/10/2024',
            gender:"male"
          },
        ]);
      }, 1000);
    }, []);
  }

  return (
    <>
      {visible && (
        <div className="nui-wrapper">
          {page === 'identity' && <Identity setPage={setPage} canReturn={characters.length > 0} />}
          {page === 'multichar' && <Multichar setPage={setPage} characters={characters} charSlots={charSlots} />}
        </div>
      )}
      {isEnvBrowser() && <DevDrawer page={page} setPage={setPage} />}
    </>
  );
}

export default App;
