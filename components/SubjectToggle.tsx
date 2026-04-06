import { useState,useEffect } from "react";
import{
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { SUBJECTS } from "@/constants";


type SubjectId=typeof SUBJECTS[number]['id']

interface SubjextToggle{
    childId:string;
    subjects:SubjectId[];
    onSave:(selectedSubjescts:SubjectId[])=>Promise<void>;
}

const SubjectToggle:React.FC<SubjextToggle>=({
    childId,
    subjects=[],
    onSave,
})=>{
    const [selected,setSelected]=useState<SubjectId[]>(subjects);
    const [isSaving,setIsSaving]=useState(false);
    const [saved,setSaved]=useState(false)

    useEffect(()=>{
        setSelected(subjects)
    },[subjects])
    
    const toggleSubject=(subjectId:SubjectId)=>{
        if(selected.includes(subjectId)){
            setSelected(selected.filter(id=>id!==subjectId))
        }
        else{
            setSelected([...selected,subjectId])
        }
    }
    const handleSave=async()=>{
        setIsSaving(true)
        setSaved(false)
        try{
            await onSave(selected)
            setSaved(true)
            setTimeout(()=>setSaved(false),2000);
        }catch (error) {
      console.error('Failed to save subjects:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
    }
return(
    <View style={styles.container}>
        <Text style={styles.title}>Allowed Games</Text>
        <Text style={styles.subtitle}>Choose what {childId? "this child": "the child"} can play</Text>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {SUBJECTS.map((subject)=>{
            const isSelected=selected.includes(subject.id);
            return(
                <TouchableOpacity
                key={subject.id}
                style={[
                    styles.subjectRow,
                    isSelected && styles.subjectRowSelected
                ]}
                onPress={()=>toggleSubject(subject.id)}
                activeOpacity={0.8}
                >
                    <View style={styles.iconContainer}>
                    <Ionicons
                    name={subject.icon}
                    size={24}
                    color={isSelected? '#0286FF':'#9AA0C3'}
                    />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={[styles.label,isSelected && styles.labelSelected]}>
                            {subject.label}
                        </Text>
                    </View>
                    <View style={styles.checkbox}>
                        <Ionicons
                        name={isSelected ? 'checkmark-circle': 'ellipse-outline'}
                        color={isSelected ? '#0286FF' : '#555'}
                        />

                    </View>
                </TouchableOpacity>
            )
        })}
        </ScrollView>
        <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : saved ? '✓ Changes Saved' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
)
}
export default SubjectToggle
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#26264A',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#9AA0C3',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  scrollContainer: {
    maxHeight: 420,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F39',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  subjectRowSelected: {
    backgroundColor: 'rgba(2, 134, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#0286FF',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#BABBC9',
    fontFamily: 'Poppins-Medium',
  },
  labelSelected: {
    color: '#fff',
  },
  checkbox: {
    padding: 4,
  },
  saveButton: {
    backgroundColor: '#0286FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#555',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});