import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Dimensions, Easing } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const FlyingBag = ({
  triggerAnimation,
  onFinish,
  arcHeight = 50,
  duration = 6000,
}) => {
  // Use useRef to maintain the animation value between renders
  const progressRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Only run animation when triggerAnimation changes to true
    if (triggerAnimation) {
      // Reset animation value
      progressRef.setValue(0);

      // Create and start animation
      Animated.timing(progressRef, {
        toValue: 1,
        duration,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1), // Smooth arc motion
        useNativeDriver: true, // Hardware acceleration
      }).start(({ finished }) => {
        // Call onFinish only if animation completed (not interrupted)
        if (finished && onFinish) onFinish();
      });
    }
  }, [triggerAnimation, duration, onFinish, progressRef]);

  // Memoized interpolations for better performance
  // Horizontal movement - smooth left to right
  const translateX = progressRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 50], // Account for icon size + padding
  });

  // Vertical movement - optimized with fewer points
  const translateY = progressRef.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -arcHeight, -arcHeight, -arcHeight / 2, 0],
    // Smoother interpolation mode for arcs
    extrapolate: "clamp",
  });

  // Optimized rotation - full 720 degrees
  const rotate = progressRef.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  // Optimized opacity and scale effects
  const opacity = progressRef.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });

  const scale = progressRef.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0.5],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.flyingBag,
        {
          transform: [{ translateX }, { translateY }, { rotate }, { scale }],
          opacity,
        },
      ]}
    >
      <MaterialIcons name="shopping-bag" size={40} color="#C60C30" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flyingBag: {
    position: "absolute",
    bottom: 100,
    left: 30,
    zIndex: 10,
  },
});

export default FlyingBag;
