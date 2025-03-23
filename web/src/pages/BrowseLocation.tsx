import React, { useEffect } from 'react';
import { Tabs, Button, Card, Group, Text, Stack, Badge, Drawer, Flex, Image, SimpleGrid } from '@mantine/core';
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
    coords: { x: -694.61, y: 5802.22, z: 17.32, w: 67.89 }
  }
];

const apartments: Location[] = [
  {
    id: 1,
    name: "Eclipse Towers Apt 31",
    description: "Luxury apartment with city view",
    image: "https://static.wikia.nocookie.net/gtawiki/images/3/3c/EclipseTowers-GTAV.png",
    coords: { x: -773.12, y: 312.45, z: 85.70, w: 175.25 }
  },
  {
    id: 2,
    name: "Alta Street Apt 57",
    description: "Modern apartment in Downtown",
    image: "https://static.wikia.nocookie.net/gtawiki/images/e/e6/3AltaStreet-GTAV.png",
    coords: { x: -269.96, y: -955.87, z: 31.22, w: 204.89 }
  },
  {
    id: 3,
    name: "Weazel Plaza Apt 26",
    description: "High-end apartment near Rockford Hills",
    image: "https://static.wikia.nocookie.net/gtawiki/images/1/11/WeazelPlaza-GTA5.png",
    coords: { x: -909.49, y: -452.36, z: 39.60, w: 118.45 }
  },
  {
    id: 4,
    name: "Del Perro Heights Apt 20",
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
  };

  useEffect(() => {
    setTimeout(() => {
      if (!opened) open();
      console.log(character)
    }, 100);
  }, []);

  const LocationCard: React.FC<{ location: Location }> = ({ location }) => (
    <Card shadow="sm" padding="md" radius="md" withBorder h={300}>
      <Card.Section>
        <Image
          src={location.image}
          height={160}
          alt={location.name}
          fit="cover"
        />
      </Card.Section>
      <Stack gap="xs" mt="md" justify="space-between" h="calc(100% - 160px)">
        <div>
          <Group justify="space-between" mb="xs">
            <Text fw={500} size="sm">{location.name}</Text>
            <Badge size="sm">ID: {location.id}</Badge>
          </Group>
          <Text size="xs" c="dimmed">{location.description}</Text>
        </div>
        <Button variant="light" fullWidth size="sm" onClick={() => handleSelect(location)}>
          Select Location
        </Button>
      </Stack>
    </Card>
  );

  return (
    <Drawer
      opened={opened}
      onClose={noop}
      title={`Select Spawn Location - ${character?.firstName || ''} ${character?.lastName || ''}`}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      offset={16}
      radius={16}
      withOverlay={false}
      size="xl"
    >
      <Flex direction={{ base: 'column', sm: 'column' }} justify="space-between" style={{ height: '88vh' }}>
        <Tabs defaultValue="last" style={{ width: '100%' }}>
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<IconApps size="0.8rem" />}>All</Tabs.Tab>
            <Tabs.Tab value="hotels" leftSection={<IconHome size="0.8rem" />}>Hotels</Tabs.Tab>
            <Tabs.Tab value="apartments" leftSection={<IconBuildingSkyscraper size="0.8rem" />}>Apartments</Tabs.Tab>
            <Tabs.Tab value="last" leftSection={<IconMapPin size="0.8rem" />}>Last Location</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="last" pt="xs">
            <Button fullWidth size="lg" onClick={() => {
                setTimeout(() => fetchNui('mps-multichar:selectedCharacter', { character }), 500);
            }}>
              Spawn at Last Location
            </Button>
          </Tabs.Panel>

          <Tabs.Panel value="all" pt="xs">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {[...hotels, ...apartments].map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="hotels" pt="xs">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {hotels.map((hotel) => (
                <LocationCard key={hotel.id} location={hotel} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="apartments" pt="xs">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {apartments.map((apartment) => (
                <LocationCard key={apartment.id} location={apartment} />
              ))}
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
        
        <Flex direction="column" align="center" gap={10}>
          <Button size="md" onClick={() => setPage('multichar')}>
            Back to Characters
          </Button>
        </Flex>
      </Flex>
    </Drawer>
  );
};

export default BrowseLocation;


