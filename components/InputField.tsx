import {TextInput,KeyboardAvoidingView, TouchableWithoutFeedback,View,StyleSheet,Text, Image, Keyboard, Platform} from 'react-native'
import React,{useState} from 'react'
import { InputFieldProps } from '@/types/type'

const InputField = ({
  labelStyle,
  label,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  placeholder,
  style,
  ...props
}:InputFieldProps) => {
    const [focused,setFocused]=useState(false)
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios"?"padding":"height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            <Text style={[styles.text,labelStyle]}>
                {label}
            </Text>
            <View style={[styles.input,focused && {borderColor:'#7C3AED',borderWidth:2,backgroundColor:'#fff'},containerStyle]}>
                
                {icon && <Image source={icon} style={[{width:20,height:20,marginLeft:4},iconStyle]} />}
                <TextInput
                onFocus={()=>setFocused(true)}
                onBlur={()=>setFocused(false)}
                style={[{borderRadius:50,padding:4,fontFamily:'Poppins-Regular',fontSize:15,flex:1,textAlign:'left'},inputStyle]}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                {...props}
                />
            </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default InputField
const styles=StyleSheet.create({
    container:{
        marginVertical:10,
        width:"100%"
    },
    text:{
        fontSize:18,
        lineHeight:28,
        fontFamily:"Poppins-Bold",
        marginBottom:3,
        color:"white"
    },
    input:{
        flex:1,
        height:50,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        position:"relative",
        backgroundColor:"#E2E8F0",
        borderRadius:50,
        borderColor:'#ccc',
        borderWidth:1
    }
})