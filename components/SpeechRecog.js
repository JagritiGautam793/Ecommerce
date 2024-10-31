// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Voice from "@react-native-voice/voice";

// const VoiceToTextSearch = ({ isListening, onSpeechResult, onSpeechEnd }) => {
//   const [error, setError] = useState("");

//   useEffect(() => {
//     Voice.onSpeechResults = handleSpeechResults;
//     Voice.onSpeechError = handleSpeechError;
//     Voice.onSpeechEnd = handleSpeechEnd;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   useEffect(() => {
//     if (isListening) {
//       startSpeechToText();
//     } else {
//       Voice.stop();
//     }
//   }, [isListening]);

//   const startSpeechToText = async () => {
//     setError("");
//     try {
//       await Voice.start("en-US");
//     } catch (e) {
//       setError("Error starting speech to text");
//       console.error(e);
//     }
//   };

//   const handleSpeechResults = (e) => {
//     if (e.value && e.value.length > 0) {
//       onSpeechResult(e.value[0]);
//     }
//   };

//   const handleSpeechError = (e) => {
//     setError("Error in speech recognition");
//     console.error(e);
//     onSpeechEnd();
//   };

//   const handleSpeechEnd = () => {
//     onSpeechEnd();
//   };

//   return (
//     <View style={styles.container}>
//       {isListening && <Text style={styles.listeningText}>Listening...</Text>}
//       {error !== "" && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: 20,
//     left: 0,
//     right: 0,
//     alignItems: "center",
//   },
//   listeningText: {
//     fontSize: 18,
//     color: "green",
//   },
//   errorText: {
//     fontSize: 16,
//     color: "red",
//   },
// });

// export default VoiceToTextSearch;
