import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';  // Import useNavigation for navigation

// Create a Context for managing the click count
const ClickContext = createContext({ clickCount: 0, incrementClickCount: () => {} });

const HomeScreen = ({ username }: { username: string | null }) => {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { clickCount, incrementClickCount } = useContext(ClickContext);
  const navigation = useNavigation();  // Hook to handle navigation

  const url = 'https://paid-udemy-course-for-free.p.rapidapi.com/search?s=a';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ccdc5492ffmshe7c8c48ddfa23c3p10c789jsn85f0487e2b6b',
      'x-rapidapi-host': 'paid-udemy-course-for-free.p.rapidapi.com'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setCourses(data); // Assuming the API returns an array of courses
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i < rating ? 'gold' : 'gray' }}>★</Text>
      );
    }
    return stars;
  };

  const renderCourse = ({ item }: { item: { id: string; pic: string; title: string; category: string; rating: number; desc_text: string } }) => {
    const isExpanded = expanded[item.id];
    const shortDescription = item.desc_text.slice(0, 100) + '...';

    return (
      <View style={styles.courseContainer}>
        <Image source={{ uri: item.pic }} style={styles.courseImage} />
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseCategory}>{item.category}</Text>
        <View style={{ flexDirection: 'row' }}>{renderStars(item.rating)}</View>
        <Text style={styles.courseDescription}>
          {isExpanded ? item.desc_text : shortDescription}
        </Text>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={{ color: '#007bff' }}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.linkButton, { marginTop: 10 }]}
          onPress={incrementClickCount}
        >
          <Text style={styles.linkText}>View Course</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Clear AsyncStorage and navigate to SignIn page
              await AsyncStorage.removeItem('username');
              navigation.navigate('SignIn');  // Navigate to the SignIn page (make sure 'SignIn' is defined in your navigator)
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleProfileClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {username ? `Hi, ${username}` : "Hi, Guest"}
        </Text>
        {username && (
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleProfileClick} style={styles.profileCircle}>
              <Text style={styles.profileText}>
                {username.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
            {isDropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.dropdownItem}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {courses.length > 0 ? (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCourse}
        />
      ) : (
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>Clicks: {clickCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

// App Component with Context Provider
const App = () => {
  const [clickCount, setClickCount] = useState(0);
  const [username, setUsername] = useState<string | null>(null);

  const incrementClickCount = () => {
    setClickCount((prev) => prev + 1);
  };

  // Simulate fetching username (you can replace this with actual sign-in logic)
  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    };
    getUsername();
  }, []);

  return (
    <ClickContext.Provider value={{ clickCount, incrementClickCount }}>
      <HomeScreen username={username} />
    </ClickContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingRight: 10,
    marginBottom: 10,
  },
  profileContainer: {
    position: 'relative',
    flexDirection: 'row', // Align profile circle with the text
    alignItems: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Space between the "Hi" message and profile circle
  },
  profileText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: 100,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseCategory: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
