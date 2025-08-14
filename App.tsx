import React from 'react';
import 'react-native-get-random-values';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import ViewTaskScreen from './src/screens/ViewTaskScreen';

export type RootStackParamList = {
  Home: undefined;
  EditTask: { mode: 'create' } | { mode: 'edit'; id: string };
  ViewTask: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const appBg = '#0f172a';
const appText = '#e5e7eb';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: appBg, card: appBg, text: appText, border: '#1f2937' },
};

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor={appBg} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: appBg },
            headerTintColor: appText,
            contentStyle: { backgroundColor: appBg },
            // ❌ remove statusBarStyle/statusBarColor here for Expo Go
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Task Manager' }} />
          <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit / Create' }} />
          <Stack.Screen name="ViewTask" component={ViewTaskScreen} options={{ title: 'Task Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
