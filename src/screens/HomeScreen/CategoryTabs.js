 
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const CategoryTabs = ({ filterCategory, setFilterCategory }) => {
  const categories = ['All', 'Personal', 'Work', 'Shopping'];

  return (
    <ScrollView horizontal style={styles.tabsContainer}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.tab, filterCategory === cat && styles.activeTab]}
          onPress={() => setFilterCategory(cat)}
        >
          <Text
            style={
              filterCategory === cat ? styles.activeTabText : styles.tabText
            }
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryTabs;
