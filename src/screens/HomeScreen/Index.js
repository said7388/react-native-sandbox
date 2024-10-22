// HomeScreen.js
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import CategoryTabs from './CategoryTabs';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All'); // Default category filter

  const addTask = (task, category) => {
    if (task.length > 0) {
      setTasks([{ key: Math.random().toString(), value: task, completed: false, category }, ...tasks]);
    }
  };

  const toggleTaskCompletion = (taskKey) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.key === taskKey ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskKey) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.key !== taskKey));
  };

  const filteredTasks = tasks.filter((task) =>
    filterCategory === 'All' ? true : task.category === filterCategory
  );

  return (
    <View className="p-8">
      <TaskInput onAddTask={addTask} />
      <CategoryTabs filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleCompletion={() => toggleTaskCompletion(item.key)}
            onDeleteTask={() => deleteTask(item.key)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;