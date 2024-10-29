import { Radio, Group, TextInput, Button, Flex, Modal, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useState } from 'react';

import styles from './Identity.module.css';
import '@mantine/dates/styles.css';
import { fetchNui } from '../utils/fetchNui';
import { useDisclosure } from '@mantine/hooks';
import { isEnvBrowser, noop } from '../utils/misc';

interface IdentityProps {
  canReturn: boolean;
  setPage: (page: string) => void;
}

const Identity: React.FC<IdentityProps> = ({ canReturn = false, setPage = noop }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [firstName, setFirstName] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<boolean>(false);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const [validationResponse, setValidationResponse] = useState<string | null>(null);

  const checkName = (name: string) => {
    const regex = /[^a-zA-Z'-\s]/g;
    const hasInvalidChars = regex.test(name);
    return hasInvalidChars;
  };

  const areParametersValid = () => {
    return (
      firstName.length > 1 &&
      !firstNameError &&
      lastName.length > 1 &&
      !lastNameError &&
      birthday !== null &&
      gender !== null
    );
  };

  const validateInformation = () => {
    close();
    const date = birthday;

    fetchNui(
      'mps-multichar:registerIdentity',
      {
        firstName,
        lastName,
        gender,
        date,
      },
      { data: { status: true, statusMessage: '' }, delay: 200 }
    )
      .then((r) => {
        if (r.status) {
          close();
        } else {
          setValidationResponse(r.statusMessage);
        }
        if (isEnvBrowser()) alert(`Info is most likely valid but you're in a browser so nuh uh`);
      })
      .catch(noop);
  };

  return (
    <>
      <Modal
        opened={true}
        closeOnClickOutside={false}
        withCloseButton={canReturn}
        closeOnEscape={false}
        onClose={canReturn ? () => setPage('multichar') : noop}
        centered
        shadow="xs"
        size="25vw"
        withOverlay={false}
        title="Register your new character"
      >
        <Flex direction="column" gap="md" style={{ padding: '0.5em', paddingBottom: '1em' }}>
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
            error={
              firstNameError
                ? `Only uppercase and lowercase letters (A-Z, a-z), spaces, hyphens (-), and apostrophes (') are allowed.`
                : null
            }
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
            error={
              lastNameError
                ? `Only uppercase and lowercase letters (A-Z, a-z), spaces, hyphens (-), and apostrophes (') are allowed.`
                : null
            }
          />

          {/* Birthday */}
          <DateInput
            value={birthday}
            onChange={setBirthday}
            label="Birthday"
            required
            placeholder="DD/MM/YYYY"
            valueFormat="DD/MM/YYYY"
          />

          {/* Gender Selector */}
          <Radio.Group name="gender" label="Please select your gender" withAsterisk>
            <Group
              mt="xs"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}
            >
              <Radio value="male" label="Male" onChange={(event) => setGender(event.currentTarget.value)} />
              <Radio value="female" label="Female" onChange={(event) => setGender(event.currentTarget.value)} />
              <Radio value="other" label="Other" onChange={(event) => setGender(event.currentTarget.value)} />
            </Group>
          </Radio.Group>

          <Flex direction="row" justify="space-evenly">
            <Button
              className={styles.resetButton}
              style={{
                width: '35%',
              }}
            >
              Reset Info
            </Button>
            <Button
              disabled={!areParametersValid()}
              className={areParametersValid() ? styles.startButton : styles.resetButton}
              style={{
                width: '35%',
              }}
              onClick={open}
            >
              Start Character
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal opened={opened} onClose={close} title="Confirmation" centered>
        <Text>Are you sure about the provided information?</Text>

        {typeof validationResponse === 'string' && validationResponse.length > 0 ? (
          <Flex gap="xs" c="#ea4141">
            <Text fw={800} td="underline">
              Impossible:
            </Text>
            <Text>{validationResponse}</Text>
          </Flex>
        ) : (
          <></>
        )}

        <Flex direction="row" justify="space-evenly" style={{ marginTop: '1em' }}>
          <Button className={styles.resetButton} style={{ width: '30%' }} onClick={close}>
            Cancel
          </Button>
          <Button style={{ width: '30%' }} onClick={validateInformation}>
            Submit
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default Identity;
