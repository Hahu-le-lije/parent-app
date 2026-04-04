import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native'
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from './InputField'; 
import CustomButton from './CustomButton'; 
import { icons } from '@/constants';
import {useChildrenStore} from '@/store/childrenStore';
import { NewChild } from '@/types/type';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

type AddChildProps={
  onClose?:()=>void
}
const { height } = Dimensions.get("window");

const LOCAL_AVATARS = [
  { id: '1', source: require('../assets/images/hahu_logo.png') },
  { id: '2', source: require('../assets/images/on2.png') },
  { id: '3', source: require('../assets/images/on3.png') },
];

const AddChild = ({onClose}:AddChildProps) => {
  const {addChild,loadChildren}=useChildrenStore()

  
  const [form, setForm] = useState<NewChild>({
    avatar: null as any,
    firstName: '',
    lastName: '',
    dob: new Date()
  })

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false)

  const onDateChange = (event: any, selectedDate?: Date) => {
  
    if (Platform.OS === 'android') setShowDatePicker(false);
    
    if (selectedDate) {
      setForm({ ...form, dob: selectedDate });
    }
  }
  const handleSave = async () => {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    console.log("Validation failed: First and Last name are required");
    Alert.alert("Error", "First and Last name are required");
    return;
  }

  try {
    let avatarString: string | undefined = undefined;


    if (form.avatar) {
      console.log("Converting avatar to base64...");
      const asset = Asset.fromModule(form.avatar as any);
      await asset.downloadAsync();              

      const localUri = asset.localUri || asset.uri;

      if (localUri) {
        const base64Data = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        avatarString = `data:image/png;base64,${base64Data}`;   
      }
    }

    
    const payload: NewChild = {
      firstName: form.firstName,
      lastName: form.lastName,
      dob: form.dob,
      avatar: avatarString|| undefined,    
    };

    console.log("Saving child with base64 avatar...");
    await addChild(payload);   
    Alert.alert("Success", "Child added successfully!", [
        { 
          text: "OK", 
          onPress: () => {
            setForm({
              avatar: null as any,
              firstName: '',
              lastName: '',
              dob: new Date()
            });
            
             onClose?.();        
          }
        }
      ]);

  } catch (error) {
    console.error("Save Error:", error);
   Alert.alert("Error", "Failed to save child. Please try again.");
  }
};
  return (
    <View style={styles.container}>
    
      <View style={styles.handle} />

      <View style={styles.sheetHeader}>
        <Text style={styles.headerTitle}>Add New Child</Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
           
            <TouchableOpacity
              style={styles.avatarTrigger}
              onPress={() => setPickerVisible(true)}
            >
              <View style={styles.avatarWrapper}>
                {form.avatar ? (
                  <Image source={form.avatar} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                    <Image 
                      source={icons.person} 
                      style={{ width: 40, height: 40, tintColor: '#BABBC9' }} 
                    />
                  </View>
                )}
                <View style={styles.editBadge}>
                   <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>EDIT</Text>
                </View>
              </View>
              <Text style={styles.avatarText}>Choose Avatar</Text>
            </TouchableOpacity>

            
            <InputField
              label="First Name"
              placeholder="Enter First Name"
              value={form.firstName}
              icon={icons.person}
              onChangeText={(v) => setForm({ ...form, firstName: v })}
            />

            <InputField
              label="Last Name"
              placeholder="Enter Last Name"
              value={form.lastName}
              icon={icons.person}
              onChangeText={(v) => setForm({ ...form, lastName: v })}
            />

            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowDatePicker(true)}
            >
              <Image source={icons.checkmark} style={styles.calendarIcon} />
              <Text style={styles.dateValue}>{form.dob.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.dob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
                textColor="white" 
              />
            )}

            <CustomButton
              title="Save Child"
              onPress={handleSave}
              style={styles.saveButton}
              IconLeft={null}
              IconRight={null}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>


      <Modal
        isVisible={isPickerVisible}
        onBackdropPress={() => setPickerVisible(false)}
        backdropOpacity={0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
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
              <TouchableOpacity 
                style={styles.avatarOption}
                onPress={() => {
                  setForm({ ...form, avatar: item.source });
                  setPickerVisible(false);
                }}
              >
                <Image source={item.source} style={styles.gridImage} />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity 
            onPress={() => setPickerVisible(false)} 
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: height * 0.8,
    backgroundColor: "#1F1F39", 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: '#3E3E55',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  sheetHeader: {
    marginTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "white",
  },
  avatarTrigger: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3D5CFF',
  },
  avatarPlaceholder: {
    backgroundColor: '#2F2F42',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3D5CFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1F1F39',
  },
  avatarText: {
    color: '#BABBC9',
    marginTop: 10,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  inputLabel: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F2F42',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    tintColor: '#3D5CFF',
    marginRight: 12,
  },
  dateValue: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  saveButton: {
    backgroundColor: '#3D5CFF',
    height: 56,
    borderRadius: 16,
    marginTop: 10,
  },
  modalCenter: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBox: {
    backgroundColor: '#2F2F42',
    padding: 24,
    borderRadius: 24,
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pickerTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  listContainer: {
    justifyContent: 'center',
  },
  avatarOption: {
    padding: 5,
  },
  gridImage: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cancelBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#BABBC9',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  }
})

export default AddChild;