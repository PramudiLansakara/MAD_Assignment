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

const SignUp: React.FC<any> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSignUp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for basic email validation
    
    if (name.trim() === "") {
      Alert.alert("Invalid Name", "Name cannot be empty.");
    } else if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
    } else if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters long."
      );
    } else {
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("SignIn");
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust as needed
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
            <Text style={styles.headerSubtitle}>
              Enter your credentials to continue
            </Text>
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
                style={[
                  styles.input,
                  focusedInput === "name" && styles.inputFocused,
                ]}
                placeholderTextColor="#B0B0B0"
              />
            </View>

            <View style={styles.fields}>
              <Text style={styles.title}>Email</Text>
              <TextInput
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                style={[
                  styles.input,
                  focusedInput === "email" && styles.inputFocused,
                ]}
                placeholderTextColor="#B0B0B0"
              />
            </View>

            <View>
              <Text style={styles.title}>Password</Text>
              <TextInput
                placeholder="******"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                style={[
                  styles.input,
                  focusedInput === "password" && styles.inputFocused,
                ]}
                placeholderTextColor="#B0B0B0"
              />
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
    height:250,
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
    color:"#333333"
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
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#606060",
    // textAlign: "center",
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
    flexDirection: 'row', 
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
