import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

import { requestPractitioner } from '@/api/guidance';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/theme';

export default function PractitionerScreen() {
  const [message, setMessage] = useState('I would like help understanding my career options.');
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    try {
      const result = await requestPractitioner(message);
      setStatus(`Request ${result.status}. Reference: ${result.id}`);
    } catch (value) {
      setStatus(value instanceof Error ? value.message : 'Unable to submit the request.');
    }
  }

  return (
    <Screen>
      <Text style={styles.heading}>Ask for human guidance</Text>
      <Text style={styles.lead}>A career practitioner can help with uncertain, sensitive or more detailed questions.</Text>
      <TextInput
        accessibilityLabel="Message for career practitioner"
        multiline
        onChangeText={setMessage}
        style={styles.input}
        value={message}
      />
      <Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>Submit request</Text></Pressable>
      {status ? <Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.navy, fontSize: 27, fontWeight: '900' },
  lead: { color: colors.text, fontSize: 16, lineHeight: 24 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, minHeight: 140, padding: spacing.md, textAlignVertical: 'top' },
  button: { alignItems: 'center', backgroundColor: colors.teal, borderRadius: 13, minHeight: 50, justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  status: { color: colors.tealDark, lineHeight: 21 },
});

