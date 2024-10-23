import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskItem = ({ task, onToggleCompletion, onDeleteTask, onToggleFavorite }) => {
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={onToggleCompletion}>
        <AntDesign
          name={task.completed ? 'checkcircle' : 'checkcircleo'}
          size={24}
          color={task.completed ? 'green' : 'gray'}
          style={styles.checkmark}
        />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskText, task.completed && styles.completedTask]}>
          {task.value}
        </Text>
        <Text style={styles.categoryText}>Category: {task.category}</Text>
      </View>
      <TouchableOpacity onPress={onToggleFavorite}>
        <AntDesign
          name={task.favorite ? 'star' : 'staro'}
          size={24}
          color={task.favorite ? 'gold' : 'gray'}
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeleteTask}>
        <FontAwesome name="trash" size={24} color="red" style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 12,
    color: 'gray',
  },
  checkmark: {
    marginRight: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  favoriteIcon: {
    marginLeft: 10,
  },
  deleteIcon: {
    marginLeft: 10,
  },
});

export default TaskItem;
