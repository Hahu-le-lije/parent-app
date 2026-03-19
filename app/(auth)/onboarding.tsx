import { View, Text, TouchableOpacity,StyleSheet,Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from "react-native-swiper"
import React,{ useRef ,useState} from 'react'
import { useRouter } from 'expo-router'
import { onboardingData } from '@/constants'
import CustomButton from '@/components/CustomButton'

const Onboarding = () => {
    const router=useRouter()
    const swipeRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const last=activeIndex===onboardingData.length-1
  return (
    <SafeAreaView style={styles.container}>
        
        <TouchableOpacity style={styles.skip} onPress={()=>router.replace('./sign-up')}>
            <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
    <Swiper ref={swipeRef}
        loop={false}
        dot={<View style={[styles.dot,{width:10}]}/>}
        activeDot={<View style={[styles.dot,{backgroundColor:"#0286FF"}]}/>}
        onIndexChanged={(index)=>{
            setActiveIndex(index)
        }}
        >
            {
                onboardingData.map((item,index)=>(
                    <View key={index} style={styles.slides}>
                        <Image
                        source={item.image}
                        style={styles.image}
                        />
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:"100%",marginTop:20}}>
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                        <Text style={styles.desc}>{item.description}</Text>
                    </View>
                ))
            }
        </Swiper>
    <CustomButton title={last? "Get Started":"Next"}
    onPress={()=> last? router.replace('/(auth)/sign-upf'):  swipeRef.current?.scrollBy(1)}
    style={{marginTop:20,width:"90%",marginBottom:20,fontFamily:"Poppins-SemiBold",backgroundColor:"#3D5CFF"}}
    />
    </SafeAreaView>
  );
}

export default Onboarding
const styles=StyleSheet.create({
    container:{
        display:"flex",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#1F1F39"
    },
    skip:{
        width:"100%",
        alignItems:"flex-end",
        padding:10,
        justifyContent:"flex-end"
    },
    skipText:{
        color:"white",
        fontSize:20,
        fontFamily:"Poppins-Bold"
    },
    dot:{
        width:32,
        height:8,
        marginHorizontal:1,
        backgroundColor:"#E2E8F0",
        borderRadius:50
    },
    slides:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        padding:5
    },
    image:{
  width:"100%",
  height:300,
  resizeMode:"contain",
  marginTop:40
},

title:{
  color:"white",
  fontSize:26,
  fontFamily:"Poppins-Bold",
  textAlign:"center",
  marginHorizontal:20,
  marginTop:30
},

desc:{
  fontSize:16,
  textAlign:"center",
  marginHorizontal:30,
  marginTop:12,
  color:"#F4F3FD",
  fontFamily:"Poppins-Regular",
  lineHeight:22
},

})