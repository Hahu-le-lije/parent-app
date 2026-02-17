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
        <View style={{flex:1,height:1,backgroundColor:'#B8B8D2'}} />
        <Text style={{marginHorizontal:10,fontSize:16,color:'#B8B8D2'}}>Or</Text>
        <View style={{flex:1,height:1,backgroundColor:'#B8B8D2'}} />
      </View>

      <CustomButton
        title="Log In With Google"
        onPress={handle}
        style={{width:"100%",backgroundColor:'transparent',borderWidth:1,borderColor:'#B8B8D2'}}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            style={{ width:20, height:20, marginRight:8 }}
          />
        )}
       
      />

    </View>
  )
}

export default OAuth
