import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Task } from '../types/Task';
import { fmtDateTime, statusLabel } from '../utils/format';

type Props = {
  task: Task;
  onPress?: () => void;
  onLongPress?: () => void;
};

const statusColor: Record<Task['status'], string> = {
  todo: colors.muted,
  in_progress: colors.warning,
  completed: colors.primary,
  cancelled: colors.danger,
};

export default function TaskCard({ task, onPress, onLongPress }: Props) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={({pressed})=>[
      styles.card, pressed && { opacity: 0.9 }
    ]}>
      <View style={[styles.badge, { backgroundColor: statusColor[task.status] }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        <Text style={styles.meta}>{fmtDateTime(task.datetime)} • {statusLabel[task.status]}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius,
    padding: spacing(2),
    flexDirection: 'row',
    gap: spacing(2),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  badge: { width: 8, height: 36, borderRadius: 4 },
  title: { color: colors.text, fontWeight: '800', fontSize: 16 },
  meta: { color: colors.subtext, marginTop: 4 },
});
