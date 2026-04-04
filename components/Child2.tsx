import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable'; 
import { useChildrenStore } from "@/store/childrenStore";
import { useRouter } from 'expo-router';
import { LOCAL_AVATARS } from '@/constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import Modal from 'react-native-modal';
import { useState } from 'react';
import { NewChild } from '@/types/type';
import { FlatList, TextInput } from 'react-native-gesture-handler';


type ChildProps = {
  item: {
    id: string;
    dob: Date;
    subscription: string;
    paid: boolean;
    avatar: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
  };
};

const Child2 = ({ item }: ChildProps) => {
  const { deleteChild,updateChild } = useChildrenStore();
  const router = useRouter();

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [form,setForm]=useState({
    name:item.firstname+' '+item.lastname,
    dob:item.dob,
    avatar:item.avatar
  })
  
  if (!item) {
    return <View style={styles.container}><Text style={{ color: 'red' }}>Error: Child data not found</Text></View>;
  }

  const onDateChange=(event:any,selectedDate?:Date)=>{
    if(Platform.OS === 'android') setShowDatePicker(false);
    if(selectedDate){
      setForm({...form,dob:selectedDate});
    }
  }
  const handleUpdate=async()=>{
    const {name,dob,avatar}=form;
    const parts = name.trim().split(' ');
    const firstname = parts[0];
    const lastname = parts.slice(1).join(' ') || ' ';
    if(!firstname.trim() || !lastname.trim() || !dob || !avatar){
      console.log("Validation Failed")
      Alert.alert("Error","You can not leave any field empty")
      return 
    }
    try{
      let avatarString: string | undefined = undefined;
      if(typeof avatar === "string"){
        avatarString=avatar;
      }else{
        console.log("converting avatar to base64");
        const asset =Asset.fromModule(avatar as any);
        await asset.downloadAsync();
        const localUri=asset.localUri || asset.uri;
        if(localUri){
          const base64Data=await FileSystem.readAsStringAsync(localUri,{
            encoding:FileSystem.EncodingType.Base64,
          })
          avatarString=`data:image/png;base64,${base64Data}`
        }
      }
      const payload:NewChild={
        firstName:firstname,
        lastName:lastname,
        dob:dob,
        avatar:avatarString
      }
      console.log("saving child with base64",payload);
      await updateChild(item.id,payload);
      Alert.alert("Success","Child Updated Successfully");
      
      setForm({
          name: firstname + " " + lastname,
          dob,
          avatar: avatarString || avatar,
        });
    }catch(e){
      console.log(e)
      Alert.alert("Error","Failed to update child")
      throw e
    }
  
  }
  const calculateAge = (dob: Date) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        if (!item?.id) return;
        Alert.alert(
          "Delete Child",
          "Are you sure you want to delete this child?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () =>{ deleteChild(item.id)
                router.push('/(root)/(tabs)/children')
              },
            },
          ]
        );
      }}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
  <View style={styles.container}>   
    <Swipeable renderRightActions={renderRightActions}>
     
      <View style={styles.content}>
    
        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <Image
            source={
              typeof form.avatar === 'string'
                ? { uri: form.avatar }
                : form.avatar
            }
            style={styles.imageH}
          />
        </TouchableOpacity>

       
        <View style={styles.main}>

       
          <Text style={{ color: '#aaa', fontSize: 12 }}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) =>
              setForm({ ...form, name: text })
            }
          />

          <Text style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>
            Age
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#3A3A55',
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: '#4CAF50', fontSize: 16 }}>
              {calculateAge(form.dob)} years
            </Text>
          </TouchableOpacity>

         
          {showDatePicker && (
            <DateTimePicker
              value={form.dob}
              mode="date"
              display={Platform.OS === 'android' ? 'default' : 'spinner'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Badges */}
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.subscription}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                item.paid
                  ? { backgroundColor: "#28a745" }
                  : { backgroundColor: "#dc3545" },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.paid ? "Paid" : "Unpaid"}
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleUpdate}
          >
            <Text style={styles.saveText}>
              Save Changes
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Swipeable>

    {/* Avatar Picker Modal */}
    <Modal
      isVisible={isPickerVisible}
      onBackButtonPress={() => setPickerVisible(false)}
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
              <Image
                source={item.source}
                style={styles.gridImage}
              />
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
);
};

export default Child2;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#2F2F42",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    minHeight: 150,
  },

  imageH: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#C4C4C4",
  },

  main: {
    flex: 1,
    marginLeft: 12,
  },

  input: {
    backgroundColor: '#3A3A55',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },

  ageBox: {
    backgroundColor: '#3A3A55',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },

  ageValue: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },

  badges: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#555",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  saveBtn: {
    marginTop: 14,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
    marginVertical: 8,
    marginRight: 8,
  },

  deleteText: {
    color: "#fff",
    fontWeight: "bold",
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
    fontWeight: 'bold',
  },

  listContainer: {
    justifyContent: 'center',
  },

  avatarOption: {
    padding: 6,
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
  },
});