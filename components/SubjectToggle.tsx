import { useSubjectStore } from "@/store/subjectStore";
import { Subject } from "@/types/type";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SubjectToggleProps {
  childId: string;
}

const SubjectToggle: React.FC<SubjectToggleProps> = ({
  childId: childId,
}: SubjectToggleProps) => {
  const { subjects, loading, loadSubjects, updateSubjects } = useSubjectStore();

  const [localSubjects, setLocalSubjects] = useState<Subject[]>([]);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  useEffect(() => {
    loadSubjects(childId);
  }, [childId, loadSubjects]);

  useEffect(() => {
    if (subjects) {
      setLocalSubjects(subjects);
    }
  }, [subjects]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(localSubjects) !== JSON.stringify(subjects);
  }, [localSubjects, subjects]);

  const toggleSubject = (id: number) => {
    setLocalSubjects((prev) =>
      prev.map((sub) =>
        sub.game_type_id === id ? { ...sub, status: !sub.status } : sub,
      ),
    );
  };

  const handleSave = async () => {
    try {
      await updateSubjects(childId, { subjects: localSubjects });
      setIsSavedSuccessfully(true);
      setTimeout(() => setIsSavedSuccessfully(false), 3000);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading && !subjects) {
    return (
      <ActivityIndicator
        size="large"
        color="#0286FF"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allowed Games</Text>
      <Text style={styles.subtitle}>
        Enable or disable subjects for this profile
      </Text>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {localSubjects.map((subject) => {
          const isSelected = subject.status;
          return (
            <TouchableOpacity
              key={subject.game_type_id}
              style={[
                styles.subjectRow,
                isSelected && styles.subjectRowSelected,
              ]}
              onPress={() => toggleSubject(subject.game_type_id)}
              activeOpacity={0.8}
            >
              <View style={styles.labelContainer}>
                <Text
                  style={[styles.label, isSelected && styles.labelSelected]}
                >
                  {subject.game_type_name}
                </Text>
              </View>

              {/* Custom Styled Checkbox (No Icons) */}
              <View
                style={[
                  styles.checkboxBase,
                  isSelected && styles.checkboxChecked,
                ]}
              >
                {isSelected && <View style={styles.checkboxInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {(hasChanges || isSavedSuccessfully) && (
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading
              ? "Saving..."
              : isSavedSuccessfully
                ? "Changes Applied"
                : "Save Changes"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SubjectToggle;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#26264A",
    borderRadius: 22,
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#9AA0C3",
    marginBottom: 20,
  },
  scrollContainer: {
    maxHeight: 420,
  },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F39",
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  subjectRowSelected: {
    backgroundColor: "rgba(2, 134, 255, 0.12)",
    borderColor: "#0286FF",
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: "#BABBC9",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  // Custom Checkbox Styles
  checkboxBase: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: "#0286FF",
    backgroundColor: "#0286FF",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  saveButton: {
    backgroundColor: "#0286FF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#444",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
