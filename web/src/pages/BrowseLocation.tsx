import React, { useEffect, useState } from 'react';
import { Tabs, Button, Card, Text, Stack, Drawer, Flex, Image, SimpleGrid, Popover, Loader, Center} from '@mantine/core';
import { IconHome, IconBuildingSkyscraper, IconApps } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { noop } from '../utils/misc';
import { fetchNui } from '../utils/fetchNui';
import { Character } from '@communityox/ox_core';
import { useNuiEvent } from '../hooks/useNuiEvent';

interface Location {
  id: number;
  name: string;
  description: string;
  image: string;
  coords: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
}

interface SpawnLocationsData {
  hotels: Location[];
  apartments: Location[];
}

interface BrowseLocationProps {
  setPage: (page: string) => void;
  character?: Character;
}

const BrowseLocation: React.FC<BrowseLocationProps> = ({ setPage, character }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [spawnLocations, setSpawnLocations] = useState<SpawnLocationsData>({
    hotels: [],
    apartments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Request spawn locations from server when component mounts
  useEffect(() => {
    fetchNui('mps-multichar:getSpawnLocations');
  }, []);

  // Listen for spawn locations data from server
  useNuiEvent('mps-multichar:receiveSpawnLocations', (data: SpawnLocationsData) => {
    setSpawnLocations(data);
    setIsLoading(false);
  });

  // Extract hotels and apartments from the loaded data
  const hotels: Location[] = spawnLocations.hotels;
  const apartments: Location[] = spawnLocations.apartments;

  const handleSelect = (location: Location) => {
    setTimeout(
      () =>
        fetchNui('mps-multichar:selectedCharacter', {
          character,
          coords: location.coords,
        }),
      500
    );
    close();
  };

  useEffect(() => {
    setTimeout(() => {
      if (!opened) open();
    }, 100);
  }, []);

  const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
    const [popoverOpened, { open, close }] = useDisclosure(false); // renamed to avoid confusion

    return (
      <Card shadow="xs" padding="sm" radius="sm" withBorder h={280}>
        <Card.Section>
          <Image src={location.image} height={140} alt={location.name} fit="cover" draggable={false} />
        </Card.Section>
        <Stack gap="xs" mt="xs" justify="space-between" h="calc(100% - 140px)">
          <div>
            <Text fw={500} size="sm" mb={4}>
              {location.name}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={2}>
              {location.description}
            </Text>
          </div>
          <Popover
            width={200}
            position="top"
            withArrow
            shadow="md"
            opened={popoverOpened}
            onChange={close}
            styles={(theme) => ({
              dropdown: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.dark[4]}`,
              },
            })}
          >
            <Popover.Target>
              <Button variant="subtle" fullWidth size="xs" onClick={() => (popoverOpened ? close() : open())}>
                Select
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack gap="xs">
                <Text size="sm" c="white">
                  Spawn at {location.name}?
                </Text>
                <Flex gap="xs">
                  <Button
                    variant="light"
                    size="xs"
                    fullWidth
                    onClick={() => {
                      handleSelect(location);
                      close();
                    }}
                  >
                    Yes
                  </Button>
                  <Button variant="subtle" size="xs" fullWidth onClick={close}>
                    No
                  </Button>
                </Flex>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Stack>
      </Card>
    );
  };

  return (
    <Drawer
      opened={opened}
      onClose={noop}
      title={`Select Location - ${character?.firstName || ''} ${character?.lastName || ''}`}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      offset={8}
      radius={4}
      withOverlay={false}
      size="lg"
      styles={{
        content: {
          overflowY: 'hidden',
        },
      }}
    >
      <Flex direction="column" style={{ height: 'calc(100vh - 80px)' }}>
        <Tabs
          defaultValue="all"
          styles={() => ({
            tab: {
              fontSize: '0.85rem',
              padding: '0.5rem 0.75rem',
            },
            panel: {
              maxHeight: 'calc(100vh - 160px)',
              overflowY: 'auto',
            },
          })}
        >
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<IconApps size="0.8rem" />}>
              All
            </Tabs.Tab>
            <Tabs.Tab value="hotels" leftSection={<IconHome size="0.8rem" />}>
              Hotels
            </Tabs.Tab>
            <Tabs.Tab value="apartments" leftSection={<IconBuildingSkyscraper size="0.8rem" />}>
              Apartments
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="xs" className="location-card-all">
            {isLoading ? (
              <Center h={200}>
                <Loader size="md" />
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {[...hotels, ...apartments].map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="hotels" pt="xs">
            {isLoading ? (
              <Center h={200}>
                <Loader size="md" />
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {hotels.map((hotel) => (
                  <LocationCard key={hotel.id} location={hotel} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="apartments" pt="xs">
            {isLoading ? (
              <Center h={200}>
                <Loader size="md" />
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                {apartments.map((apartment) => (
                  <LocationCard key={apartment.id} location={apartment} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>
        </Tabs>

        <Flex gap="xs" mt="auto" mb={8}>
          <Button
            variant="subtle"
            size="sm"
            style={{ flex: 1 }}
            onClick={() => {
              setPage('multichar');
              character = undefined;
            }}
          >
            Back to Characters
          </Button>

          <Popover
            width={200}
            position="top"
            withArrow
            shadow="md"
            styles={(theme) => ({
              dropdown: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.colors.dark[4]}`,
              },
            })}
          >
            <Popover.Target>
              <Button variant="light" size="sm" style={{ flex: 1 }}>
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
                      setTimeout(() => fetchNui('mps-multichar:selectedCharacter', { character }), 500);
                      close();
                    }}
                  >
                    Yes
                  </Button>
                  <Button variant="subtle" size="xs" fullWidth>
                    No
                  </Button>
                </Flex>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Flex>
    </Drawer>
  );
};

export default BrowseLocation;
