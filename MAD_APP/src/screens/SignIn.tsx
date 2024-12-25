import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn: React.FC<any> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  interface LoginResponse {
    token: string;
  }

  const handleSignIn = async () => {
    if (name.trim() === "") {
      Alert.alert("Invalid Name", "Name cannot be empty.");
    } else if (password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters long.");
    } else {
      try {
        const response = await axios.post<LoginResponse>("http://192.168.1.13:5000/api/auth/login", {
          name: name,
          password: password,
        });
  
        if (response.status === 200) {
          const { token } = response.data;
          await AsyncStorage.setItem("userToken", token);
          await AsyncStorage.setItem("username", name);  // Store username here
          Alert.alert("Success", "Signed in successfully!");
          navigation.navigate("Home", { username: name });
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Login Failed",
          error.response?.data?.message || "Please check your username and password."
        );
      }
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://www.imagella.com/cdn/shop/products/f8bcfe945c1bfdfc9bc5978f0e1726cd.jpg?v=1692451182",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sign In</Text>
            <Text style={styles.headerSubtitle}>Enter your credentials to continue</Text>
          </View>
          <View style={styles.form}>
            <View>
              <Text style={styles.title}>Username</Text>
              <TextInput
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
                style={[styles.input, focusedInput === "name" && styles.inputFocused]}
                placeholderTextColor="#B0B0B0"
              />
            </View>

            <View style={styles.fields}>
              <Text style={styles.title}>Password</Text>
              <TextInput
                placeholder="******"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                style={[styles.input, focusedInput === "password" && styles.inputFocused]}
                placeholderTextColor="#B0B0B0"
              />
            </View>
          </View>

          <View style={styles.button}>
            <TouchableOpacity style={styles.buttonTouchable} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alreadyAccountContainer}>
            <Text style={styles.alreadyAccountText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  innerContainer: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  header: {
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingVertical: 2,
    color: "#333333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  form: {
    marginTop: 10,
  },
  fields: {
    marginVertical: 15,
  },
  title: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#e2e2e2",
    paddingVertical: 4,
    fontSize: 14,
    textDecorationLine: "none",
  },
  inputFocused: {
    borderColor: "#000000",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTouchable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 2.5,
  },
  alreadyAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  alreadyAccountText: {
    color: "#606060",
    marginRight: 5,
  },
  signUpText: {
    color: "#007BFF",
    fontWeight: "600",
  },
});

export default SignIn;
