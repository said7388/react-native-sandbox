// HomeScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import CategoryTabs from './CategoryTabs';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All'); // Default category filter

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (task, category) => {
    if (task.length > 0) {
      const newTasks = [
        {
          key: Math.random().toString(),
          value: task,
          completed: false,
          category,
          favorite: false,
        },
        ...tasks,
      ];
      setTasks(newTasks);
      saveTasks(newTasks); // Save to AsyncStorage
    }
  };

  const toggleTaskCompletion = (taskKey) => {
    const updatedTasks = tasks.map((task) =>
      task.key === taskKey ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks); // Save to AsyncStorage
  };

  const deleteTask = (taskKey) => {
    const updatedTasks = tasks.filter((task) => task.key !== taskKey);
    setTasks(updatedTasks);
    saveTasks(updatedTasks); // Save to AsyncStorage
  };

  const toggleFavorite = (taskKey) => {
    const updatedTasks = tasks.map((task) =>
      task.key === taskKey ? { ...task, favorite: !task.favorite } : task,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks); // Save to AsyncStorage
  };

  const filteredTasks = tasks.filter((task) =>
    filterCategory === 'All' ? true : task.category === filterCategory,
  );

  useEffect(() => {
    loadTasks(); // Load tasks when the component mounts
  }, []);

  return (
    <View className="p-8">
      <TaskInput onAddTask={addTask} />
      <CategoryTabs
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleCompletion={() => toggleTaskCompletion(item.key)}
            onToggleFavorite={() => toggleFavorite(item.key)}
            onDeleteTask={() => deleteTask(item.key)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
