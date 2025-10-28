import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonColor = "bg-accent/30",
  cancelButtonColor = "bg-accent"
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <SafeAreaView className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="w-full h-fit bg-primary rounded-[10px] p-[20px] flex flex-col justify-between">
          <Text className="text-white font-bold text-xl">
            {title}
          </Text>
          <Text className="text-white text-base mt-2">
            {message}
          </Text>
          <View className="flex flex-row gap-[10px] justify-end mt-4">
            <TouchableOpacity
              onPress={onCancel}
              className={`w-[100px] ${cancelButtonColor} rounded-lg py-3.5 flex flex-row items-center justify-center`}
            >
              <Text className="text-white font-semibold text-base">{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`w-[100px] ${confirmButtonColor} rounded-lg py-3.5 flex flex-row items-center justify-center`}
            >
              <Text className="text-white font-semibold text-base">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ConfirmationModal;
