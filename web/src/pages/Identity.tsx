import { Radio, Paper, Title, Group, TextInput, Button, Flex } from "@mantine/core"
import { DateInput } from "@mantine/dates";
import { useState } from "react";

import styles from './Identity.module.css';
import '@mantine/dates/styles.css';

const Identity = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [firstNameError, setFirstNameError] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>("");
    const [lastNameError, setLastNameError] = useState<boolean>(false);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [gender, setGender] = useState<string | null>(null);

    const checkName = (name: string) => {
        const regex = /[^a-zA-Z'-\s]/g;
        const hasInvalidChars = regex.test(name);
        return hasInvalidChars;
    };

    const areParametersValid = () => {
        return (
            firstName.length > 1 && !firstNameError &&
            lastName.length > 1  && !lastNameError &&
            birthday !== null &&
            gender !== null
        )
    };

    return (
        <Paper shadow="xs" p="xl" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            width: '20vw',
            maxWidth: '20vw',
        }}>
            <Title order={3}>Register your new character</Title>
            
            {/* First Name Input */}
            <TextInput
                label="First Name"
                placeholder="John"
                required
                value={firstName}
                onChange={(event) => {
                    const name = event.currentTarget.value;
                    setFirstNameError(checkName(name));
                    setFirstName(name);
                }}
                withErrorStyles={false}
                error={firstNameError ? `Only uppercase and lowercase letters (A-Z, a-z), spaces, hyphens (-), and apostrophes (') are allowed.` : null}
            />
            {/* Surname Input */}
            <TextInput
                label="Surname"
                placeholder="Doe of Lancaster"
                required
                value={lastName}
                onChange={(event) => {
                    const name = event.currentTarget.value;
                    setLastNameError(checkName(name));
                    setLastName(name);
                }}
                withErrorStyles={false}
                error={lastNameError ? `Only uppercase and lowercase letters (A-Z, a-z), spaces, hyphens (-), and apostrophes (') are allowed.` : null}
                
            />

            {/* Birthday */}
            <DateInput
                value={birthday}
                onChange={setBirthday}
                label="Birthday"
                placeholder="DD/MM/YYYY"
                valueFormat="YYYY MMM DD"
            />

            {/* Gender Selector */}
            <Radio.Group
                name="gender"
                label="Please select your gender"
                withAsterisk
            >
                <Group
                    mt="xs" 
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly'
                    }}    
                >
                    <Radio value="male" label="Male" onChange={event => setGender(event.currentTarget.value)}/>
                    <Radio value="female" label="Female" onChange={event => setGender(event.currentTarget.value)}/>
                    <Radio value="other" label="Other" onChange={event => setGender(event.currentTarget.value)}/>
                </Group>
            </Radio.Group>

            <Flex
                direction="row"
                justify="space-around"
            >
                <Button
                    className={styles.resetButton}
                    style={{
                        width: '45%',
                    }}
                >
                    Reset Info
                </Button>
                <Button
                    disabled={!areParametersValid()}
                    className={areParametersValid() ? styles.startButton : styles.resetButton}
                    style={{
                        width: '45%'
                    }}
                >
                    Start Character
                </Button>
            </Flex>
        </Paper>
    )
}

export default Identity;