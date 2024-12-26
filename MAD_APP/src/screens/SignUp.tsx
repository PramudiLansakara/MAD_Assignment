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

interface RegisterResponse {
  message: string;
  token?: string;
}

const SignUp: React.FC<any> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (name.trim() === "") {
      newErrors.name = "Name cannot be empty.";
    }
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post<RegisterResponse>(
        "http://192.168.1.13:5000/api/auth/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        Alert.alert("Registration Successful", "Account created successfully");

        if (response.data.token) {
          await AsyncStorage.setItem("authToken", response.data.token);
        }

        navigation.navigate("SignIn");
      }
    } catch (error: any) {
      console.error("Registration Error:", error.message);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong. Please try again."
      );
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
            <Text style={styles.headerTitle}>Sign Up</Text>
            <Text style={styles.headerSubtitle}>Enter your credentials to continue</Text>
          </View>
          <View style={styles.form}>
            <View>
              <Text style={styles.title}>Username</Text>
              <TextInput
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                  }
                }}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
                style={[
                  styles.input,
                  focusedInput === "name" && styles.inputFocused,
                ]}
                placeholderTextColor="#B0B0B0"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.fields}>
              <Text style={styles.title}>Email</Text>
              <TextInput
                placeholder="example@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                  }
                }}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                style={[
                  styles.input,
                  focusedInput === "email" && styles.inputFocused,
                ]}
                placeholderTextColor="#B0B0B0"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View>
              <Text style={styles.title}>Password</Text>
              <TextInput
                placeholder="******"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
                  }
                }}
                secureTextEntry
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                style={[
                  styles.input,
                  focusedInput === "password" && styles.inputFocused,
                ]}
                placeholderTextColor="#B0B0B0"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity style={styles.buttonTouchable} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alreadyAccountContainer}>
            <Text style={styles.alreadyAccountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInText}>Sign In</Text>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#606060",
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
  signInText: {
    color: "#007BFF",
    fontWeight: "600",
  },
});

export default SignUp;
