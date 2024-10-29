import React, { useEffect } from 'react';
import { Accordion, Button, Code, Drawer, Flex, Text, Tooltip } from '@mantine/core';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { BsPerson } from 'react-icons/bs';
import { noop } from '../utils/misc';
import { fetchNui } from '../utils/fetchNui';
import { Character } from '@overextended/ox_core';

const canDelete = false;
const canCreate = true;

interface MulticharProps {
  characters: Character[];
  charSlots: number;
  setPage: (page: string) => void;
}

const Multichar: React.FC<MulticharProps> = ({ characters = [], setPage, charSlots = 1 }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const clipboard = useClipboard({ timeout: 2000 });

  const selectCharacter = (character: Character) => {
    close();
    setTimeout(() => fetchNui('mps-multichar:selectedCharacter', character), 500);
  };

  const createNewCharacter = () => {
    setPage('identity');
  };

  useEffect(() => {
    setTimeout(() => {
      if (!opened) open();
    }, 100);
  }, []);

  if (characters.length == 0) return <></>;

  const charAccordeon = characters.map((item) => (
    <Accordion.Item key={`${item.charId}`} value={`${item.charId}`}>
      <Accordion.Control icon={<BsPerson />}>
        {item.firstName} {item.lastName}
      </Accordion.Control>
      <Accordion.Panel>
        <Text>
          State ID:
          <Tooltip label={!clipboard.copied ? 'Click to copy' : 'Copied !'} color="#3c3c3c" c="#545454">
            <Code
              style={{
                fontSize: 15,
              }}
              onClick={() => {
                clipboard.copy(item.stateId);
                setTimeout(() => clipboard.reset(), 2000);
              }}
            >
              {item.stateId}
            </Code>
          </Tooltip>
        </Text>

        <Text>Last Played: {item.lastPlayed}</Text>

        {canDelete ? (
          <Flex justify="space-around" style={{ padding: '0.5em 1em' }}>
            <Button style={{ width: '30%' }}>Delete</Button>
            <Button style={{ width: '30%' }}>Play</Button>
          </Flex>
        ) : (
          <Flex justify="space-around" style={{ padding: '0.5em 1em' }}>
            <Button style={{ width: '30%' }} onClick={() => selectCharacter(item)}>
              Play
            </Button>
          </Flex>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <>
      <Drawer
        opened={opened}
        onClose={noop}
        title="Character Selection"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        offset={16}
        radius={16}
        withOverlay={false}
      >
        <Flex direction={{ base: 'column', sm: 'column' }} justify="space-between" style={{ height: '88vh' }}>
          <Accordion variant="separated" defaultValue={`${characters[0].charId}`}>
            {charAccordeon}
          </Accordion>
          {canCreate && (
            <Flex direction="column" align="center" gap={10}>
              {characters.length !== charSlots && (
                <Button size="md" onClick={createNewCharacter}>
                  New Character
                </Button>
              )}
              <Text size="sm">
                Slots Available: {characters.length}/{charSlots}
              </Text>
            </Flex>
          )}
        </Flex>
      </Drawer>
    </>
  );
};

export default Multichar;
