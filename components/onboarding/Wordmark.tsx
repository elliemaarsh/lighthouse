import { StyleSheet, Text, View } from 'react-native';

import { typography } from '@/constants/theme';

type WordmarkProps = {
  style?: object;
};

export function Wordmark({ style }: WordmarkProps) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.text}>LIGHTHOUSE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: 60,
  },
  text: {
    ...typography.wordmark,
    textAlign: 'center',
  },
});
