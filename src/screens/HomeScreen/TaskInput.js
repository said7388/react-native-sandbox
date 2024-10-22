import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const TaskInput = ({ onAddTask }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('Personal');

  const handleAddTask = () => {
    if (task.trim()) { // Check if task is not empty
      onAddTask(task, category);
      setTask(''); // Clear input after adding
    }
  };

  return (
    <View className="flex-col mb-5">
      <TextInput
        placeholder="Add a new task"
        className="border border-gray-400 p-2 rounded mb-2 w-full"
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <View className="flex-row mb-2">
        <Picker
          selectedValue={category}
          className="flex-1" // Takes up remaining space in the row
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Personal" value="Personal" />
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Shopping" value="Shopping" />
        </Picker>
      </View>
      <Button title="Add Task" onPress={handleAddTask} color="#4CAF50" />
    </View>
  );
};

export default TaskInput;