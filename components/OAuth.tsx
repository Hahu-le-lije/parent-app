import { View, Text, Image } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { icons } from '@/constants'
import {useOAuth} from '@clerk/clerk-expo'
const OAuth = () => {
  const {startOAuthFlow,isLoading}=useOAuth({strategy:'oauth_google'})
    const handle=async()=>{
        try{
          const {createdSessionId,signIn,signUp,setActive}=await startOAuthFlow()
          if(createdSessionId){
            setActive!({session:createdSessionId})
          }
          else if(signUp?.createdSessionId){
            setActive!({session:signUp.createdSessionId})
          }
          else if(signIn?.createdSessionId){
            setActive!({session:signIn.createdSessionId})
          }
        }catch(err:any){
            console.error('google auth error: ',err)
        }
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
        disabled={isLoading}
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
