 
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskItem = ({
  task,
  onToggleCompletion,
  onDeleteTask,
  onToggleFavorite,
}) => {
  return (
    <View className="flex-row items-center p-4 bg-[#f8f8f8] border-b border-[#ddd] mt-2 rounded">
      <TouchableOpacity onPress={onToggleCompletion}>
        <AntDesign
          name={task.completed ? 'checkcircle' : 'checkcircleo'}
          size={24}
          color={task.completed ? 'green' : 'gray'}
        />
      </TouchableOpacity>
      <View className="ml-2.5 flex-1">
        <Text
          className="text-base"
          style={[task.completed && styles.completedTask]}
        >
          {task.value}
        </Text>
        <Text className="text-gray-400 text-xs">Category: {task.category}</Text>
      </View>
      <TouchableOpacity className="ml-2.5" onPress={onToggleFavorite}>
        <AntDesign
          name={task.favorite ? 'star' : 'staro'}
          size={24}
          color={task.favorite ? 'gold' : 'gray'}
        />
      </TouchableOpacity>
      <TouchableOpacity className="ml-2.5" onPress={onDeleteTask}>
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default TaskItem;
