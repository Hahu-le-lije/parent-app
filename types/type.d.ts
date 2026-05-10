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
  id: string;
  dob: Date;
  subscription: string;
  paid: boolean;
  avatar: string;
  username: string;
  password:string
  firstname:string
  lastname:string
};
export interface NewChild {
  firstName: string;
  lastName: string;
  dob: Date;
  avatar?: string;
}
export interface Subscription{
id:string;
owner_id:string;
plan_type:string;
available_slots:number;
status:string;
ends_at:Date;
tx_ref:string
}
export interface DailyProgress {
    data:{
        child_id:string;
        summary_date:Date;
        total_sessions:number;
        total_questions:number;
        correct_answers:number;
        accuracy:number;
        time_spent:number;
        consistency:number;
        skill_diversity:number;
        mastery_score:number;
        generated_explanation:string;
        algorithm_version:1
    }
}
export interface WeeklyProgress {
    data:{
        child_id:string;
        week_start_date:Date;
        week_end_date:Date;
        total_sessions:number;
        total_questions:number;
        correct_answers:number;
        accuracy:number;
        time_spent:number;
        consistency:number;
        skill_diversity:number;
        mastery_score:number;
        generated_explanation:string;
        algorithm_version:1
    }
}
export interface Analytics{
    daily_summary:{
        child_id:string;
        summary_date:Date;
        total_sessions:number;
        total_questions:number;
        correct_answers:number;
        accuracy:number;
        time_spent:number;
        consistency:number;
        skill_diversity:number;
        mastery_score:number;
        generated_explanation:string;
        algorithm_version:1
    },
    weekly_summary:{
        child_id:string;
        week_start_date:Date;
        week_end_date:Date;
        total_sessions:number;
        total_questions:number;
        correct_answers:number;
        accuracy:number;
        time_spent:number;
        consistency:number;
        skill_diversity:number;
        mastery_score:number;
        generated_explanation:string;
        algorithm_version:1
    }
}