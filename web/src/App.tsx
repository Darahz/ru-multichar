import { useState } from 'react';
import { isEnvBrowser } from './utils/misc';
import { useNuiEvent } from './hooks/useNuiEvent';
import Identity from './pages/Identity';
import DevDrawer from './utils/DevDrawer';
import Multichar from './pages/MultiChar';

function App() {
  const [visible, setVisible] = useState<boolean>(isEnvBrowser());
  const [page, setPage] = useState<string>('multichar');
  const [charSlots, setCharSlots] = useState<number>(1);

  useNuiEvent('setVisible', (data: { visible?: boolean, page?: string }) => {
    setVisible(data.visible || false);
    if (data.page) setPage(data.page);
  });

  useNuiEvent('setConfig', (data: {maxSlots: number}) => {
    setCharSlots(data.maxSlots);
  })

  return (
    <>
      {visible && (
        <div className="nui-wrapper">
          {page === 'identity' && <Identity />}
          {page === 'multichar' && <Multichar setPage={setPage} charSlots={charSlots} />}
        </div>
      )}
      {isEnvBrowser() && <DevDrawer page={page} setPage={setPage} />}
    </>
  );
}

export default App;
