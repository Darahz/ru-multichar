import React, { useEffect, useState } from "react";
import { Accordion, Button, Code, Drawer, Flex, Text, Tooltip } from "@mantine/core";
import { useClipboard } from '@mantine/hooks';
import { BsPerson } from "react-icons/bs";
import { isEnvBrowser, noop } from "../utils/misc";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";

const canDelete = false;
const canCreate = true;

interface MulticharProps {
    charSlots: number;
    setPage: (page: string) => void;
}

const Multichar: React.FC<MulticharProps> = ({ setPage, charSlots = 1}) => {
    const clipboard = useClipboard({ timeout: 2000 });
    const [characters, setCharacters] = useState<any[]>([]);

    useNuiEvent('setupCharacters', (data: {characters: any[]}) => {
        setCharacters(data.characters);
    });

    if (isEnvBrowser()) {
        useEffect(() => {
            setTimeout(() => {
                setCharacters([
                    {
                        charId: 1,
                        stateId: "IJ0221",
                        firstName: "Maximus",
                        lastName: "Prime",
                        x: 411.69232177734375,
                        y: -1628.4000244140625,
                        z: 29.2799072265625,
                        heading: 243.77952575683594,
                        lastPlayed: "26/10/2024"
                        
                    }
                ])
            }, 1000);
        }, []);
    };

    const selectCharacter = (character: any) => {
        fetchNui('mps-multichar:selectedCharacter', character);
    };

    const createNewCharacter = () => {
        setPage('identity');
    }

    if (characters.length == 0) return <></>;

    const charAccordeon = characters.map((item) => (
        <Accordion.Item key={`${item.charId}`} value={`${item.charId}`}>
            <Accordion.Control icon={<BsPerson />}>{item.firstName} {item.lastName}</Accordion.Control>
            <Accordion.Panel>
                <Text>State ID:
                    <Tooltip label={!clipboard.copied ? "Click to copy" : "Copied !"} color="#3c3c3c" c="#545454">
                        <Code
                            style={{
                                fontSize: 15
                            }}
                            onClick={() => {
                                clipboard.copy(item.stateId);
                                setTimeout(() => clipboard.reset(), 2000);
                            }}
                        >{item.stateId}</Code>
                    </Tooltip>
                </Text>

                <Text>Last Played: {item.lastPlayed}</Text>

                {
                    canDelete ?
                    <Flex
                        justify="space-around"
                        style={{padding: "0.5em 1em"}}
                    >
                        <Button style={{width: '30%'}}>Delete</Button>
                        <Button style={{width: '30%'}}>Play</Button>
                    </Flex> :
                    <Flex
                        justify="space-around"
                        style={{padding: "0.5em 1em"}}
                    >
                        <Button style={{width: '30%'}} onClick={() => selectCharacter(item)}>Play</Button>
                    </Flex>
                }
            </Accordion.Panel>

        </Accordion.Item>
      ));

    return (<>
        <Drawer
            opened={true} onClose={noop} title="Character Selection"
            closeOnClickOutside={false} closeOnEscape={false} withCloseButton={false}
            offset={16} radius={16}
            withOverlay={false}
        >
            <Flex
                direction={{ base: 'column', sm: 'column' }}
                justify="space-between"
                style={{height: '88vh'}}
            >
                <Accordion variant="separated" defaultValue={`${characters[0].charId}`}>
                    {charAccordeon}
                </Accordion>
                {
                    canCreate && <Flex
                        direction="column"
                        align="center"
                        gap={10}
                    >
                        { characters.length !== charSlots && <Button size="md" onClick={createNewCharacter}>New Character</Button> }
                        <Text size="sm">Slots Available: {characters.length}/{charSlots}</Text>
                    </Flex>
                }
            </Flex>
        </Drawer>
    </>);
}

export default Multichar;