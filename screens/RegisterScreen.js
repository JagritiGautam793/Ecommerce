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
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };

    axios
      .post("http://192.168.29.229:8000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration Successful",
          "You have registered successfully"
        );
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Registration Error", "Invalid Details");
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
              <Text style={styles.headerText}>Create an Account</Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  style={styles.inputIcon}
                  name="person"
                  size={24}
                  color="#ffffff"
                />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholder="Enter your Name"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                />
              </View>
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
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.registerButtonPressed,
              ]}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.loginContainer}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginLink}>Sign In</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    backgroundColor: "rgba(20, 20, 20, 0.8)",
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
    fontSize: 25,
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
  registerButton: {
    backgroundColor: "#FFC107",
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
  registerButtonPressed: {
    backgroundColor: "#FFB300",
    transform: [{ scale: 0.98 }],
  },
  registerButtonText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    padding: 10,
  },
  loginText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loginLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#FFC107",
  },
});

export default RegisterScreen;
