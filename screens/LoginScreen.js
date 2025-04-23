import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Main");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://10.12.39.31:8000/login", user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.replace("Main");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid Email");
        console.log(error);
      });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://t3.ftcdn.net/jpg/04/55/53/78/360_F_455537818_2AwVoujHe2gH7IRYTgrZ932Nt4MdwTXD.jpg",
      }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Login to Your Account</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  style={styles.inputIcon}
                  name="email"
                  size={24}
                  color="#ffffff"
                />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="Enter your Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <AntDesign
                  style={styles.inputIcon}
                  name="lock1"
                  size={24}
                  color="#ffffff"
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  style={styles.input}
                  placeholder="Enter your Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <Text style={styles.optionText}>Keep me logged in</Text>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </View>

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Register")}
              style={styles.registerContainer}
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerLink}>Sign Up</Text>
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay for better contrast
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(20, 20, 20, 0.8)", // Darker, more opaque background
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 10,
  },
  optionText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
  },
  forgotPasswordText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: "#FFC107", // Brighter yellow for better visibility
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  loginButtonPressed: {
    backgroundColor: "#FFB300", // Slightly darker when pressed
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    textAlign: "center",
    color: "#000000", // Black text for better contrast on yellow button
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    padding: 10,
  },
  registerText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  registerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#FFC107", // Matching yellow for consistency
  },
});

export default LoginScreen;
