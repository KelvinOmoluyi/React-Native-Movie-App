import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type FormInputProps = {
  placeho: string;
  onTextChange: (text: string) => void;
  value: string;
}

const PasswordInput = ({placeho, onTextChange, value }: FormInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <View
    style={styles.input} >
      <TextInput 
      placeholder={placeho} 
      onChangeText={onTextChange}
      secureTextEntry ={!showPassword}
      value={value}
      style={{flex: 1, color: "#e7e7e7"}}
      placeholderTextColor="#8E8D83"
      autoFocus={false}
      autoComplete="off"
      textContentType="none"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Ionicons 
          name={showPassword ? "eye-outline" : "eye-off-outline"} 
          size={20} 
          color="#8E8D83" 
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    input: { 
        height: 52, width: "100%", backgroundColor: "#26262680", boxShadow: "0 0 1px #898989",
        borderRadius: 8, paddingHorizontal: 16, 
        fontSize: 16, 
        display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"
    }
})

export default PasswordInput