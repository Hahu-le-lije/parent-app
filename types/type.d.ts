import {TextInputProps, TouchableOpacityProps} from "react-native";
declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}
declare interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
                      latitude,
                      longitude,
                      address,
                  }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}
declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
    rightText?: string;

    onRightPress?: () => void;
}
export type Child = {
  _id: string;
  id: number;
  name: string;
  //dob: Date;
  subscription: string;
  paid: boolean;
  image: string;
  //username:string,
  age:number;
  //password:string
  //firstname:string
  //lastname:string
};
