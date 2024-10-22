import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons
import HomeScreen from './HomeScreen';
import Navbar from './Navbar';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

// Wrapper component for screens with Navbar
const ScreenWithNavbar = ({ children, title }) => {
  return (
    <View className="flex-1">
      <Navbar title={title} />
      {children}
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#42a5f5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithNavbar title="Home Page">
            <HomeScreen />
          </ScreenWithNavbar>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithNavbar title="Settings">
            <SettingsScreen />
          </ScreenWithNavbar>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ headerShown: false }}
      >
        {() => (
          <ScreenWithNavbar title="Profile">
            <ProfileScreen />
          </ScreenWithNavbar>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;