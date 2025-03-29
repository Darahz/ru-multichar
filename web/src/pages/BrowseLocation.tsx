import React, { useEffect } from 'react';
import { Tabs, Button, Card, Group, Text, Stack, Drawer, Flex, Image, SimpleGrid, Popover, rgba } from '@mantine/core';
import { IconHome, IconBuildingSkyscraper, IconMapPin, IconApps } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { noop } from '../utils/misc';
import { fetchNui } from '../utils/fetchNui';
import { Character } from '@overextended/ox_core';

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

const hotels: Location[] = [
  {
    id: 1,
    name: "Pink Cage Motel",
    description: "Affordable motel in Sandy Shores",
    image: "https://static.wikia.nocookie.net/gtawiki/images/2/22/ThePinkCageMotel-FrontView-GTAV.PNG",
    coords: { x: 324.55, y: -229.77, z: 54.22, w: 158.88 }
  },
  {
    id: 2,
    name: "Von Crastenburg Hotel",
    description: "Luxury hotel in Downtown Los Santos",
    image: "https://static.wikia.nocookie.net/gtawiki/images/6/65/VonCrastenburgHotel-Vinewood-Back-GTAV.png",
    coords: { x: -1477.14, y: -674.45, z: 29.04, w: 131.12 }
  },
  {
    id: 3,
    name: "Bayview Lodge",
    description: "Peaceful motel near Paleto Bay",
    image: "https://static.wikia.nocookie.net/gtawiki/images/1/1b/BayviewLodge-GTAV.png",
    coords: { x: -688.30, y: 5763.90, z: 17.33, w: 64.14 }
  }
];

const apartments: Location[] = [
  {
    id: 4,
    name: "Eclipse Towers",
    description: "Luxury apartment with city view",
    image: "https://static.wikia.nocookie.net/gtawiki/images/3/3c/EclipseTowers-GTAV.png",
    coords: { x: -773.12, y: 312.45, z: 85.70, w: 175.25 }
  },
  {
    id: 5,
    name: "Alta Street",
    description: "Modern apartment in Downtown",
    image: "https://static.wikia.nocookie.net/gtawiki/images/e/e6/3AltaStreet-GTAV.png",
    coords: { x: -269.96, y: -955.87, z: 31.22, w: 204.89 }
  },
  {
    id: 6,
    name: "Weazel Plaza",
    description: "High-end apartment near Rockford Hills",
    image: "https://static.wikia.nocookie.net/gtawiki/images/1/11/WeazelPlaza-GTA5.png",
    coords: { x: -909.49, y: -452.36, z: 39.60, w: 118.45 }
  },
  {
    id: 7,
    name: "Del Perro Heights",
    description: "Beachside luxury living",
    image: "https://static.wikia.nocookie.net/gtawiki/images/0/03/DelPerroHeights-GTAV.png",
    coords: { x: -1447.06, y: -537.96, z: 34.74, w: 208.34 }
  }
];

interface BrowseLocationProps {
  setPage: (page: string) => void;
  character?: Character;
}

const BrowseLocation: React.FC<BrowseLocationProps> = ({ setPage, character }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleSelect = (location: Location) => {
    setTimeout(() => fetchNui('mps-multichar:selectedCharacter', {
        character,
        coords: location.coords
      }), 500);
      close();
  };

  useEffect(() => {
    setTimeout(() => {
      if (!opened) open();
    }, 100);
  }, []);

  const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
    const [popoverOpened, { open, close }] = useDisclosure(false);  // renamed to avoid confusion

    return (
      <Card shadow="xs" padding="sm" radius="sm" withBorder h={280}>
        <Card.Section>
          <Image
            src={location.image}
            height={140}
            alt={location.name}
            fit="cover"
            draggable={false}
          />
        </Card.Section>
        <Stack gap="xs" mt="xs" justify="space-between" h="calc(100% - 140px)">
          <div>
            <Text fw={500} size="sm" mb={4}>{location.name}</Text>
            <Text size="xs" c="dimmed" lineClamp={2}>{location.description}</Text>
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
              }
            })}
          >
            <Popover.Target>
              <Button 
                variant="subtle" 
                fullWidth 
                size="xs"
                onClick={() => popoverOpened ? close() : open()}
              >
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
                  <Button 
                    variant="subtle" 
                    size="xs" 
                    fullWidth
                    onClick={close}
                  >
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
    >
      <Flex direction="column" style={{ height: 'calc(100vh - 80px)' }}>
        <Tabs defaultValue="all" styles={() => ({
          tab: {
            fontSize: '0.85rem',
            padding: '0.5rem 0.75rem',
          },
          panel: {
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto'
          }
        })}>
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<IconApps size="0.8rem" />}>All</Tabs.Tab>
            <Tabs.Tab value="hotels" leftSection={<IconHome size="0.8rem" />}>Hotels</Tabs.Tab>
            <Tabs.Tab value="apartments" leftSection={<IconBuildingSkyscraper size="0.8rem" />}>Apartments</Tabs.Tab>
            <Tabs.Tab value="last" leftSection={<IconMapPin size="0.8rem" />}>Last Location</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="last" pt="xs">
            <Button 
              variant="light"
              size="md" 
              fullWidth
              onClick={() => {
                setTimeout(() => fetchNui('mps-multichar:selectedCharacter', { character }), 500);
              }}
            >
              Spawn at Last Location
            </Button>
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="xs">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {[...hotels, ...apartments].map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="hotels" pt="xs">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {hotels.map((hotel) => (
                <LocationCard key={hotel.id} location={hotel} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="apartments" pt="xs">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {apartments.map((apartment) => (
                <LocationCard key={apartment.id} location={apartment} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
        
        <Button 
          variant="subtle" 
          size="sm" 
          onClick={() => {
            setPage('multichar')
            character = undefined;
          }}
          mt="auto"
          mb={8}
        >
          Back to Characters
        </Button>
      </Flex>
    </Drawer>
  );
};

export default BrowseLocation;


