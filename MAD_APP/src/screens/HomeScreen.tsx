import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';

interface Course {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  sale_price_usd: number;
  url: string;
}

const HomeScreen = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const fetchCourses = async () => {
      const url = 'https://udemy-paid-courses-for-free-api.p.rapidapi.com/rapidapi/courses/?page=1&page_size=10';
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '4a87d7fccemsh441079159958dcfp14f04fjsndcd84b415aca',
          'x-rapidapi-host': 'udemy-paid-courses-for-free-api.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.get<{ courses: Course[] }>(url, options);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderCourse = ({ item }: { item: Course }) => (
    <View style={styles.courseContainer}>
      <Image source={{ uri: item.image }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{item.name}</Text>
      <Text style={styles.courseCategory}>{item.category}</Text>
      <Text style={styles.courseDescription}>{item.description}</Text>
      <Text style={styles.coursePrice}>
        Sale Price: ${item.sale_price_usd || 'Free'}
      </Text>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => Linking.openURL(item.url)}
      >
        <Text style={styles.linkText}>View Course</Text>
      </TouchableOpacity>
    </View>
  );

  // Conditional rendering for loading, error, or courses
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading courses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Ensure id is defined or fallback to random string
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  coursePrice: {
    fontSize: 14,
    fontWeight: 'bold',
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
});

export default HomeScreen;