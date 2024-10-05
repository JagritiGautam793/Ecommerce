// const SpeechRecognition = ({ onSpeechResult, renderButton }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

//   useEffect(() => {
//     const checkVoiceAvailability = async () => {
//       try {
//         const isAvailable = await Voice.isAvailable();
//         setIsVoiceAvailable(isAvailable);

//         if (isAvailable) {
//           Voice.onSpeechStart = onSpeechStart;
//           Voice.onSpeechEnd = onSpeechEnd;
//           Voice.onSpeechResults = onSpeechResults;
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     checkVoiceAvailability();

//     return () => {
//       Voice.destroy().then(() => {
//         Voice.removeAllListeners();
//       });
//     };
//   }, []);

//   const onSpeechStart = () => setIsListening(true);
//   const onSpeechEnd = () => setIsListening(false);
//   const onSpeechResults = (event) => {
//     onSpeechResult(event.value[0]);
//   };

//   const toggleListening = async () => {
//     try {
//       const hasPermission = await requestMicrophonePermission();
//       if (!hasPermission) {
//         console.log("Microphone permission denied");
//         return;
//       }

//       if (isListening) {
//         await Voice.stop();
//       } else {
//         const locale = Platform.OS === "android" ? "" : "en-US"; // Default locale
//         await Voice.start(locale);
//       }
//     } catch (error) {
//       console.error("Error toggling speech recognition:", error);
//     }
//   };

//   // If voice is not available, display a fallback message
//   if (!isVoiceAvailable) {
//     return <Text>Speech recognition not available</Text>;
//   }

//   // If a custom renderButton is provided, render the button with mic status
//   if (renderButton) {
//     return renderButton({ isListening, onPress: toggleListening });
//   }

//   // Default mic button rendering
//   return (
//     <TouchableOpacity
//       style={[styles.button, isListening && styles.buttonListening]}
//       onPress={toggleListening}
//     >
//       <Feather
//         name={isListening ? "mic-off" : "mic"}
//         size={24}
//         color={isListening ? "red" : "black"}
//       />
//     </TouchableOpacity>
//   );
// };
