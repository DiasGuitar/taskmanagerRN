import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors, spacing, radius } from "../theme";
import { Task, TaskStatus } from "../types/Task";
import { addTask, getTasks, updateTask } from "../storage/tasksStore";
import {
  validateTitle,
  validateDateTime,
  validateLocation,
} from "../utils/validation";
import { fmtDateTime } from "../utils/format";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

type PickerStep = "closed" | "date" | "time";

export default function EditTaskScreen({ route, navigation }: any) {
  const { mode, id } = route.params || { mode: "create" };
  const isEdit = mode === "edit";

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [datetime, setDatetime] = useState<number>(Date.now());
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  // picker state
  const [pickerStep, setPickerStep] = useState<PickerStep>("closed");
  const [tempDate, setTempDate] = useState<Date>(new Date());

  useEffect(() => {
    (async () => {
      if (isEdit && id) {
        const tasks = await getTasks();
        const t = tasks.find((x) => x.id === id);
        if (t) {
          setTitle(t.title);
          setDesc(t.description ?? "");
          setDatetime(t.datetime);
          setLocation(t.location ?? "");
          setStatus(t.status);
        }
      }
    })();
  }, [isEdit, id]);

  function openPicker() {
    Keyboard.dismiss();
    setTempDate(new Date(datetime));
    if (Platform.OS === "ios") {
      setPickerStep("date"); // overlay modal with calendar first
    } else {
      // ANDROID: open system DATE dialog
      setShowAndroidPicker({ open: true, mode: "date" });
    }
  }

  // ----- ANDROID flow (native dialogs) -----
  const [showAndroidPicker, setShowAndroidPicker] = useState<{
    open: boolean;
    mode: "date" | "time";
  }>({ open: false, mode: "date" });

  function onAndroidChange(e: DateTimePickerEvent, selected?: Date) {
    if (e.type === "dismissed") {
      setShowAndroidPicker({ open: false, mode: "date" }); // close so screen remains clickable
      return;
    }
    if (!selected) return;

    if (showAndroidPicker.mode === "date") {
      // keep previous time, change date
      const prev = new Date(datetime);
      const next = new Date(selected);
      next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
      setDatetime(next.getTime());

      // chain to TIME
      setShowAndroidPicker({ open: true, mode: "time" });
    } else {
      // save time on same date
      const base = new Date(datetime);
      base.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setDatetime(base.getTime());

      setShowAndroidPicker({ open: false, mode: "date" }); // CLOSE
    }
  }

  // ----- iOS overlay flow -----
  function closeOverlay() {
    setPickerStep("closed"); // single source of truth — prevents “unclickable screen”
  }

  function onIOSConfirmDate(d: Date) {
    // update tempDate date, keep time
    const prev = new Date(tempDate);
    const next = new Date(d);
    next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
    setTempDate(next);
    setPickerStep("time"); // move to time view inside the same modal
  }

  function onIOSConfirmTime(t: Date) {
    const final = new Date(tempDate);
    final.setHours(t.getHours(), t.getMinutes(), 0, 0);
    setDatetime(final.getTime());
    closeOverlay();
  }

  async function onSave() {
    if (!validateTitle(title))
      return Alert.alert("Validation", "Title must be at least 3 characters.");
    if (!validateDateTime(datetime))
      return Alert.alert("Validation", "Please pick a valid date and time.");
    if (!validateLocation(location))
      return Alert.alert("Validation", "Please enter a location/address.");

    const now = Date.now();
    if (isEdit && id) {
      const tasks = await getTasks();
      const old = tasks.find((t) => t.id === id);
      const updated: Task = {
        id,
        title: title.trim(),
        description: desc.trim(),
        datetime,
        location: location.trim(),
        status,
        createdAt: old?.createdAt ?? now,
        updatedAt: now,
      };
      await updateTask(updated);
    } else {
      const t: Task = {
        id: uuidv4(),
        title: title.trim(),
        description: desc.trim(),
        datetime,
        location: location.trim(),
        status,
        createdAt: now,
        updatedAt: now,
      };
      await addTask(t);
    }
    Keyboard.dismiss();
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.h1}>{isEdit ? "Edit Task" : "New Task"}</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={colors.subtext}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Optional details"
            placeholderTextColor={colors.subtext}
            style={[styles.input, { height: 100 }]}
            multiline
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit
          />

          <Text style={styles.label}>Date & Time</Text>
          <Pressable
            onPress={openPicker}
            style={[styles.input, styles.pressInput]}
          >
            <Text style={styles.pressInputText}>
              {fmtDateTime(datetime) || "Pick date & time"}
            </Text>
          </Pressable>
          <Text style={styles.hint}>
            Tap to pick a date (calendar), then time.
          </Text>

          <Text style={styles.label}>Location (address)</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g., 1600 Amphitheatre Pkwy"
            placeholderTextColor={colors.subtext}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            {(
              ["todo", "in_progress", "completed", "cancelled"] as TaskStatus[]
            ).map((s) => (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[styles.statusBtn, status === s && styles.statusActive]}
              >
                <Text style={styles.statusText}>{s.replace("_", " ")}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                navigation.goBack();
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onSave}>
              <Text style={styles.save}>Save</Text>
            </Pressable>
          </View>

          {/* ANDROID native dialogs */}
          {Platform.OS === "android" && showAndroidPicker.open && (
            <DateTimePicker
              value={new Date(datetime)}
              mode={showAndroidPicker.mode}
              display="default"
              is24Hour
              onChange={onAndroidChange}
            />
          )}

          {/* iOS OVERLAY MODAL */}
          {Platform.OS === "ios" && (
            <Modal
              visible={pickerStep !== "closed"}
              transparent
              animationType="fade"
              onRequestClose={closeOverlay}
              presentationStyle="overFullScreen"
            >
              <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>
                    {pickerStep === "date" ? "Pick a Date" : "Pick a Time"}
                  </Text>

                  {pickerStep === "date" && (
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display="inline" // readable calendar on iOS
                      themeVariant="dark"
                      onChange={(_, d) => {
                        if (d) setTempDate(d);
                      }}
                      style={styles.pickerIOS}
                    />
                  )}

                  {pickerStep === "time" && (
                    <DateTimePicker
                      value={tempDate}
                      mode="time"
                      is24Hour
                      display="spinner" // big, high-contrast numbers
                      themeVariant="dark"
                      onChange={(_, d) => {
                        if (d) setTempDate(d);
                      }}
                      style={styles.pickerIOS}
                    />
                  )}

                  <View style={styles.modalActions}>
                    <Pressable
                      onPress={closeOverlay}
                      style={[styles.btn, styles.btnGhost]}
                    >
                      <Text style={styles.btnGhostText}>Cancel</Text>
                    </Pressable>

                    {pickerStep === "date" ? (
                      <Pressable
                        onPress={() => setPickerStep("time")}
                        style={[styles.btn, styles.btnPrimary]}
                      >
                        <Text style={styles.btnPrimaryText}>Next</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => onIOSConfirmTime(tempDate)}
                        style={[styles.btn, styles.btnPrimary]}
                      >
                        <Text style={styles.btnPrimaryText}>Save</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.bg, padding: spacing(2) },
  h1: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing(2),
  },
  label: {
    color: colors.subtext,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius,
    padding: spacing(1.5),
  },
  hint: { color: colors.subtext, marginTop: spacing(1) },
  pressInput: { justifyContent: "center" },
  pressInputText: { color: colors.text },

  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing(1) },
  statusBtn: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.card,
  },
  statusActive: { borderColor: colors.primary },
  statusText: { color: colors.text, textTransform: "capitalize" },

  footer: {
    marginTop: spacing(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancel: { color: colors.subtext, fontSize: 16 },
  save: {
    backgroundColor: colors.primary,
    color: "#00110a",
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing(2),
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing(2),
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing(1.5),
  },
  pickerIOS: { alignSelf: "stretch" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing(1.5),
    marginTop: spacing(2),
  },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhostText: { color: colors.subtext, fontWeight: "700" },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: colors.primaryText, fontWeight: "900" },
});
