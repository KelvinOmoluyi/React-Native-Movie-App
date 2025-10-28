import React from 'react';
import { TextInput } from 'react-native';

type FormInputProps = {
  placeho: string;
  type?: keyboardType;
  showPassword?: boolean;
  onTextChange: (text: string) => void;
  setShowPassword?: () => void;
  value: string;
}

type keyboardType = 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'visible-password' | 'web-search' | undefined;

const FormInput = ({placeho, showPassword = true, setShowPassword, onTextChange, value }: FormInputProps) => {
  return (
    <TextInput 
    placeholder={placeho} 
    onChangeText={onTextChange}
    secureTextEntry ={!showPassword}
    value={value}
    style={{ 
      height: 52, width: "100%", backgroundColor: "#26262680", boxShadow: "0 0 1px #898989",
      borderRadius: 8, paddingHorizontal: 16, 
      color: "white", fontSize: 16, 
    }} 
    placeholderTextColor="#8E8D83"
    textContentType="none"
    />
  )
}

export default FormInput