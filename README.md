# Task Manager – React Native (Expo + TypeScript)

A simple mobile app to create, view, sort, update, and delete tasks. All data is stored **locally** on the device using AsyncStorage.

- **Repository:** https://github.com/DiasGuitar/taskmanagerRN  
- **Demo video (Google Drive):** https://drive.google.com/drive/folders/1pXWWq__lNghiprFRRWi8agXtZKvHdGoy?usp=sharing  
- **APK (Android):** upload the built `.apk` to the same Drive folder (public link)

---

## Features (mapped to the assignment)

- **Add Task fields:** Title, Description, **Date & Time** (native picker flow), **Location (manual text)**, Status  
- **Task List:** shows **title • date/time • status**, with sorting by **Date added** or **Status**  
- **Manage Tasks:** mark **In Progress / Completed / Cancelled**, **Edit**, **Delete**, and **View details**  
- **Appearance:** clean **dark theme**, modern components, light status-bar icons for contrast  
- **Local Storage:** persisted via **AsyncStorage** (data survives app restarts)  
- **Validation & Errors:** title min length, non-empty location, valid date/time → friendly alerts

---

## Tech Stack & Why

- **Expo + React Native (TypeScript)** – fast dev, strong typing, easy cloud builds (EAS)
- **React Navigation (native-stack)** – native headers/gestures, typed routes
- **AsyncStorage** – simple local persistence for offline use
- **@react-native-community/datetimepicker** – native date/time UI on iOS/Android
- **date-fns** – robust, localized date formatting
- **uuid + react-native-get-random-values** – reliable unique IDs on device

---

## Screens & Flow

- **Home** – list of tasks, segmented control to sort by **Date / Status**, **+** FAB to create  
- **Edit / Create** – form with Title, Description, Location, Status, and Date & Time  
  - **iOS:** overlay modal → pick **date** (calendar) then **time** (spinner)  
  - **Android:** native dialogs for date → time  
- **View Task** – details with quick status actions, Edit, and Delete (with confirm)

---

## Run Locally

```bash
npm install
npx expo start


