import { View, Text, Image } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { icons } from '@/constants'

const OAuth = () => {
    const handle=async()=>{
        
    }
  return (
    <View style={{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      marginTop:20
    }}>

      <View style={{
        flexDirection:'row',
        alignItems:'center',
        width:"100%",
        marginBottom:15
      }}>
        <View style={{flex:1,height:1,backgroundColor:'#ccc'}} />
        <Text style={{marginHorizontal:10,fontSize:16}}>Or</Text>
        <View style={{flex:1,height:1,backgroundColor:'#ccc'}} />
      </View>

      <CustomButton
        title="Log In With Google"
        onPress={handle}
        style={{width:"100%"}}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            style={{ width:20, height:20, marginRight:8 }}
          />
        )}
        bgVariant='outline'
        textVariant='outlineT'
      />

    </View>
  )
}

export default OAuth
