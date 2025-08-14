import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { colors, spacing } from '../theme';
import { Task } from '../types/Task';
import { getTasks, deleteTask } from '../storage/tasksStore';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { useFocusEffect } from '@react-navigation/native';

type SortKey = 'createdAt' | 'status';

export default function HomeScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');

  function sort(list: Task[], key: SortKey) {
    if (key === 'createdAt') return [...list].sort((a,b)=>b.createdAt - a.createdAt);
    const rank: Record<Task['status'], number> = { in_progress: 0, todo: 1, completed: 2, cancelled: 3 };
    return [...list].sort((a,b)=> rank[a.status]-rank[b.status] || b.createdAt - a.createdAt);
  }

  async function load() {
    const all = await getTasks();
    setTasks(sort(all, sortBy));
  }

  useFocusEffect(useCallback(() => { load(); }, [sortBy]));

  async function onDelete(id: string) {
    await deleteTask(id);
    await load();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Tasks</Text>
        <View style={styles.segment}>
          <Pressable onPress={()=> setSortBy('createdAt')} style={[styles.segBtn, sortBy==='createdAt' && styles.segActive]}>
            <Text style={[styles.segText, sortBy==='createdAt' && styles.segTextActive]}>Date</Text>
          </Pressable>
          <Pressable onPress={()=> setSortBy('status')} style={[styles.segBtn, sortBy==='status' && styles.segActive]}>
            <Text style={[styles.segText, sortBy==='status' && styles.segTextActive]}>Status</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ gap: spacing(2), padding: spacing(2), paddingBottom: spacing(10) }}
        data={tasks}
        keyExtractor={t=>t.id}
        ListEmptyComponent={<EmptyState/>}
        renderItem={({item})=>(
          <TaskCard
            task={item}
            onPress={()=> navigation.navigate('ViewTask', { id: item.id })}
            onLongPress={()=> onDelete(item.id)}
          />
        )}
      />

      {/* Floating Add Button */}
      <Pressable
        onPress={()=> navigation.navigate('EditTask', { mode:'create' })}
        style={styles.fab}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing(2), paddingTop: spacing(3), paddingBottom: spacing(1), gap: spacing(2) },
  h1: { color: colors.text, fontSize: 30, fontWeight:'900' },

  segment: {
    flexDirection:'row', backgroundColor: colors.surface, borderRadius: 999, padding: 4, gap: 4,
    borderColor: colors.border, borderWidth:1, alignSelf:'flex-start'
  },
  segBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  segActive: { backgroundColor: colors.primary },
  segText: { color: colors.subtext, fontWeight:'700' },
  segTextActive: { color: colors.primaryText },

  fab: {
    position:'absolute', right: spacing(2), bottom: spacing(2),
    backgroundColor: colors.primary, width: 56, height: 56, borderRadius: 28,
    alignItems:'center', justifyContent:'center', shadowColor:'#000', shadowOpacity:0.25, shadowRadius:10, elevation:6
  },
  fabText: { color: colors.primaryText, fontSize: 28, fontWeight:'900', lineHeight: 28 },
});
