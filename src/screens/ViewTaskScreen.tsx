import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { Task } from '../types/Task';
import { getTasks, deleteTask, setStatus } from '../storage/tasksStore';
import { fmtDateTime, statusLabel } from '../utils/format';

export default function ViewTaskScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    (async () => {
      const all = await getTasks();
      setTask(all.find(t => t.id === id) ?? null);
    })();
  }, [id]);

  if (!task) {
    return <View style={styles.container}><Text style={styles.miss}>Task not found.</Text></View>;
  }

  async function changeStatus(s: Task['status']) {
  if (!task) return;               // <- guard inside the function
  await setStatus(task.id, s);
  const all = await getTasks();
  setTask(all.find(t => t.id === task.id) ?? null);
}

function onDelete() {
  if (!task) return;               // <- guard inside the function
  Alert.alert('Delete task?', 'This action cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteTask(task.id);
        navigation.goBack();
      }
    }
  ]);
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}

      <View style={styles.box}>
        <Text style={styles.label}>When</Text>
        <Text style={styles.value}>{fmtDateTime(task.datetime)}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{task.location}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{statusLabel[task.status]}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={()=> navigation.navigate('EditTask', { mode:'edit', id: task.id })}>
          <Text style={styles.link}>Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete}>
          <Text style={[styles.link, { color: colors.danger }]}>Delete</Text>
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        {(['in_progress','completed','cancelled'] as Task['status'][]).map(s => (
          <Pressable key={s} onPress={()=> changeStatus(s)} style={styles.cta}>
            <Text style={styles.ctaText}>{s.replace('_',' ')}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor: colors.bg, padding: spacing(2) },
  title:{ color: colors.text, fontSize: 22, fontWeight:'800' },
  desc:{ color: colors.subtext, marginTop: spacing(1), lineHeight: 20 },
  box:{ marginTop: spacing(2), backgroundColor: colors.card, borderColor: colors.border, borderWidth:1, borderRadius: radius, padding: spacing(2) },
  label:{ color: colors.subtext, marginBottom: 6 },
  value:{ color: colors.text, fontWeight:'700' },
  actions:{ marginTop: spacing(2), flexDirection:'row', gap: spacing(3) },
  link:{ color: colors.text, textDecorationLine:'underline' },
  statusRow:{ marginTop: spacing(3), flexDirection:'row', gap: spacing(2) },
  cta:{ backgroundColor: colors.muted, paddingVertical:10, paddingHorizontal:16, borderRadius: 999 },
  ctaText:{ color: colors.text, textTransform:'capitalize', fontWeight:'700' },
  miss:{ color: colors.text, padding: spacing(2) },
});
