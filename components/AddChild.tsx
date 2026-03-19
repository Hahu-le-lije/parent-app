import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList,  ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import Modal from 'react-native-modal'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from './InputField'

const LOCAL_AVATARS = [
  { id: '1', source: require('../assets/images/hahu_logo.png') },
  { id: '2', source: require('../assets/images/on2.png') },
  { id: '3', source: require('../assets/images/on3.png') },
];

const AddChild = () => {
  const [form, setForm] = useState({
    avatar: null,
    firstName: '',
    lastName: '',
    dOB: new Date()
  })
  
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false)

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) setForm({ ...form, dOB: selectedDate })
  }

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('dob', form.dOB.toISOString());

      if (form.avatar) {
        const asset = Image.resolveAssetSource(form.avatar);
       
        formData.append('avatar', {
          uri: asset.uri,
          name: 'avatar.png',
          type: 'image/png',
        });
      }

      console.log("Saving Child...", formData);
    
    } catch (error) {
      console.error("Save Error:", error);
    }
  }

  return (
   <View style={styles.container}>
    <ScrollView
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
    >

   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
     
      <View style={styles.sheetHeader}>
        <Text style={styles.headerTitle}>Add New Child</Text>
      </View>

      <View style={styles.sheetContent}>
       
        <TouchableOpacity 
          style={styles.avatarTrigger} 
          onPress={() => setPickerVisible(true)}
        >
          {form.avatar ? (
            <Image source={form.avatar} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
              <Text style={{color: '#aaa', fontSize: 12}}>Optional</Text>
            </View>
          )}
        </TouchableOpacity>

        <InputField
          label="First name"
          placeholder="Enter First name"
          value={form.firstName}
          onChangeText={(v) => setForm({ ...form, firstName: v })}
        />

        <InputField
          label="Last Name"
          placeholder="Enter Last Name"
          value={form.lastName}
          onChangeText={(v) => setForm({ ...form, lastName: v })}
        />

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateLabel}>Date of Birth</Text>
          <Text style={styles.dateValue}>{form.dOB.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.dOB}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Child</Text>
        </TouchableOpacity>
      </View>


      
    
    </TouchableWithoutFeedback>
     </ScrollView>
     <Modal 
        isVisible={isPickerVisible}
        onBackdropPress={() => setPickerVisible(false)}
        backdropOpacity={0.8}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        style={styles.modalCenter}
      >
        <View style={styles.pickerBox}>
          <Text style={styles.pickerTitle}>Select Avatar</Text>
          <FlatList
            data={LOCAL_AVATARS}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                setForm({...form, avatar: item.source});
                setPickerVisible(false);
              }}>
                <Image source={item.source} style={styles.gridImage} />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setPickerVisible(false)} style={styles.cancelBtn}>
             <Text style={{color: '#0286FF', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
     </View>
  
  )
}
const {height}=Dimensions.get("window")
const styles = StyleSheet.create({
  container: { paddingBottom: 20, height:height*0.75,backgroundColor:"#2F2F42",borderTopLeftRadius: 20,
    borderTopRightRadius: 20 },
  scrollContent: {
    padding: 24,
    paddingBottom: 40, 
  },
  sheetHeader: { marginBottom: 20 },
  headerTitle: { fontFamily: "Poppins-Bold", fontSize: 18, color: "white" },
  sheetContent: { flex: 1 },
  avatarTrigger: { alignSelf: 'center', marginBottom: 20 },
  avatarImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 1, borderColor: '#3D3D5C' },
  avatarPlaceholder: { backgroundColor: '#3D3D5C', justifyContent: 'center', alignItems: 'center' },
  dateInput: { backgroundColor: '#3D3D5C', padding: 15, borderRadius: 10, marginVertical: 10 },
  dateLabel: { color: '#888', fontSize: 12 },
  dateValue: { color: 'white', marginTop: 5 },
  saveButton: { backgroundColor: '#0286FF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  

  modalCenter: { margin: 0, justifyContent: 'center', alignItems: 'center' },
  pickerBox: { backgroundColor: '#2F2F42', padding: 20, borderRadius: 20, width: '85%' },
  pickerTitle: { color: 'white', textAlign: 'center', marginBottom: 15, fontSize: 18, fontWeight: 'bold' },
  listContainer: { alignItems: 'center' },
  gridImage: { width: 70, height: 70, margin: 10, borderRadius: 35 },
  cancelBtn: { marginTop: 15, alignItems: 'center' }
})

export default AddChild;