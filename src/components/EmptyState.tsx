import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function EmptyState() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.subtitle}>Tap “+” to create your first task.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing(4), alignItems: 'center' },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing(1) },
  subtitle:{ color: colors.subtext, fontSize: 14 }
});
