import React, { useEffect } from 'react';
import { Accordion, Button, Code, Drawer, Flex, Stack, Text, Tooltip, Popover } from '@mantine/core';
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
  onSelectCharacter: (character: Character) => void;
}

const Multichar: React.FC<MulticharProps> = ({ 
  characters = [], 
  setPage, 
  charSlots = 1,
  onSelectCharacter 
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const clipboard = useClipboard({ timeout: 2000 });

  const selectCharacter = (character: Character) => {
    onSelectCharacter(character);
    setPage('browseLocation');
  };

  const handleLastLocation = (character: Character) => {
    setTimeout(() => fetchNui('mps-multichar:selectedCharacter', { character }), 500);
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

  const charAccordeon = characters.map((item) => {
    const [lastLocationOpened, { open: openLastLocation, close: closeLastLocation }] = useDisclosure(false);

    return (
      <Accordion.Item key={`${item.charId}`} value={`${item.charId}`}>
        <Accordion.Control icon={<BsPerson size="0.8rem" />}>
          <Text size="sm">{item.firstName} {item.lastName}</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            <Text size="sm">
              State ID:
              <Tooltip label={!clipboard.copied ? 'Click to copy' : 'Copied !'}>
                <Code
                  style={{
                    fontSize: '0.85rem',
                    marginLeft: '0.5rem',
                    cursor: 'pointer'
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

            <Text size="sm">Last Played: {item.lastPlayed}</Text>

            <Flex gap="xs" mt="xs">
              <Button 
                variant="light"
                size="xs"
                style={{ flex: 1 }}
                onClick={() => selectCharacter(item)}
              >
                Select
              </Button>
              <Popover 
                width={200}
                position="bottom"
                withArrow
                shadow="md"
                opened={lastLocationOpened}
                onChange={closeLastLocation}
                styles={(theme) => ({
                  dropdown: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.colors.dark[4]}`,
                  }
                })}
              >
                <Popover.Target>
                  <Button 
                    variant="subtle"
                    size="xs"
                    style={{ flex: 1 }}
                    onClick={() => lastLocationOpened ? closeLastLocation() : openLastLocation()}
                  >
                    Last Location
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Stack gap="xs">
                    <Text size="sm" c="white">
                      Spawn at last location?
                    </Text>
                    <Flex gap="xs">
                      <Button 
                        variant="light" 
                        size="xs" 
                        fullWidth
                        onClick={() => {
                          handleLastLocation(item);
                          closeLastLocation();
                          close();
                        }}
                      >
                        Yes
                      </Button>
                      <Button 
                        variant="subtle" 
                        size="xs" 
                        fullWidth
                        onClick={closeLastLocation}
                      >
                        No
                      </Button>
                    </Flex>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            </Flex>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <Drawer
      opened={opened}
      onClose={noop}
      title="Character Selection"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      offset={8}
      radius={4}
      withOverlay={false}
      size="md"
    >
      <Flex direction="column" style={{ height: 'calc(100vh - 80px)' }}>
        <Accordion 
          variant="filled"
          defaultValue={`${characters[0]?.charId}`}
          styles={(theme) => ({
            item: {
              marginBottom: '0.5rem',
              border: '1px solid ' + theme.colors.gray[8],
              borderRadius: theme.radius.sm,
            },
            control: {
              padding: '0.5rem 1rem',
            },
            panel: {
              padding: '0.75rem',
            }
          })}
        >
          {charAccordeon}
        </Accordion>
        
        {canCreate && (
          <Flex direction="column" align="center" gap="xs" mt="auto" mb={8}>
            {characters.length !== charSlots && (
              <Button 
                size="sm"
                variant="light"
                onClick={createNewCharacter}
              >
                New Character
              </Button>
            )}
            <Text size="xs" c="dimmed">
              Slots Available: {characters.length}/{charSlots}
            </Text>
          </Flex>
        )}
      </Flex>
    </Drawer>
  );
};

export default Multichar;
