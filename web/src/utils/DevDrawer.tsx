import { useDisclosure } from '@mantine/hooks';
import { DiAptana } from 'react-icons/di';
import { Button, Drawer, Radio, Stack, Title } from '@mantine/core';
import React from 'react';

interface DevDrawerProps {
  page: string;
  setPage: (name: string) => void;
}

const DevDrawer: React.FC<DevDrawerProps> = ({ page, setPage }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Development Drawer" position="right">
        <Title order={3}>Page Selector</Title>
        <Stack style={{ marginTop: '1em' }}>
          <Radio
            value="identity"
            checked={'identity' === page}
            onChange={(e) => setPage(e.target.value)}
            label="Identity"
          />
          <Radio
            value="multichar"
            checked={'multichar' === page}
            onChange={(e) => setPage(e.target.value)}
            label="Multicharacter"
          />
          <Radio
            value="browseLocation"
            checked={'browseLocation' === page}
            onChange={(e) => setPage(e.target.value)}
            label="Locations"
          />
        </Stack>
      </Drawer>

      <Button
        onClick={open}
        style={{
          position: 'fixed',
          zIndex: 10,
          right: '1vh',
          top: '1vh',
          padding: 0,
          height: '3em',
          width: '3em',
        }}
      >
        <DiAptana size="1.5em" />
      </Button>
    </>
  );
};

export default DevDrawer;
