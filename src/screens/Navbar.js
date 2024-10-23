import { FontAwesome } from '@expo/vector-icons'; // For toggle icon
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Navbar = ({ title }) => {
  const handleToggleMenu = () => {
    alert('Toggle Menu');
  };

  return (
    <View className="flex flex-row justify-between items-center px-6 py-5 bg-gray-100 border-b border-gray-300 mt-5">
      <Text className="text-2xl font-bold">
        {title}
      </Text>
      <TouchableOpacity onPress={handleToggleMenu}>
        <FontAwesome name="bars" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;