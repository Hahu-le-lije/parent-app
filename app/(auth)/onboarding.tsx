import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from "react-native-swiper"
import React, { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { onboardingData } from '@/constants'
import CustomButton from '@/components/CustomButton'

const Onboarding = () => {
    const router = useRouter()
    const swipeRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboardingData.length - 1;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity 
                style={styles.skipContainer} 
                onPress={() => router.replace('/(auth)/sign-up')}
                activeOpacity={0.7}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <Swiper 
                ref={swipeRef}
                loop={false}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                
                paginationStyle={styles.pagination}
                onIndexChanged={(index) => setActiveIndex(index)}
            >
                {onboardingData.map((item, index) => (
                    <View key={index} style={styles.slide}>
                        <Image
                            source={item.image}
                            style={styles.image}
                        />
                       
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </View>
                ))}
            </Swiper>

            <View style={styles.footer}>
                <CustomButton 
                    title={isLastSlide ? "Get Started" : "Next"}
                    onPress={() => 
                        isLastSlide 
                        ? router.replace('/(auth)/sign-up') 
                        : swipeRef.current?.scrollBy(1)
                    }
                    style={{ backgroundColor: "#0286FF", width: "100%" }} 
                    IconLeft={null}
                    IconRight={null}
                />
            </View>
        </SafeAreaView>
    );
}

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1F1F39",
    },
    skipContainer: {
        width: "100%",
        paddingHorizontal: 24,
        paddingTop: 10,
        alignItems: "flex-end",
    },
    skipText: {
        color: "#9AA0C3", 
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    image: {
        width: "100%",
        height: 280,
        resizeMode: "contain",
    },
    textContainer: {
        marginTop: 40,
        alignItems: 'center',
        paddingBottom:80
    },
    title: {
        color: "white",
        fontSize: 28,
        fontFamily: "Poppins-Bold",
        textAlign: "center",
        lineHeight: 34,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 16,
        color: "#9AA0C3",
        fontFamily: "Poppins-Regular",
        lineHeight: 24,
    },
    pagination: {
        bottom: 70, 
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#0286FF",
        marginHorizontal: 4,
    },
    footer: {
        width: "100%",
        paddingHorizontal: 24,
        paddingBottom: 30,
    }
});