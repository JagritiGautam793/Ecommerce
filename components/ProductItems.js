import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductItems = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  return (
    <Pressable style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item?.image }} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {item?.title}
          </Text>
        </View>

        <View style={styles.priceRatingContainer}>
          <Text style={styles.price}>₹{item?.price}</Text>
          <Text style={styles.rating}>{item?.rating?.rate} ratings</Text>
        </View>

        <Pressable
          onPress={() => addItemToCart(item)}
          style={[
            styles.addToCartButton,
            addedToCart && styles.addedToCartButton,
          ]}
        >
          {addedToCart ? (
            <Text style={[styles.buttonText, styles.addedButtonText]}>
              Added To Cart
            </Text>
          ) : (
            <Text style={styles.buttonText}>Add to Cart</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
};

export default ProductItems;

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.5,
    elevation: 5,
  },
  imageContainer: {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  infoContainer: {
    padding: 12,
    backgroundColor: "white",
    minHeight: 140, // Added minimum height to ensure enough space
  },
  titleContainer: {
    minHeight: 45, // Increased minimum height for title
    marginBottom: 10, // Increased margin bottom
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3436",
    lineHeight: 20,
    flexWrap: "wrap", // Ensures text wraps properly
  },
  priceRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2d3436",
    letterSpacing: 0.5,
  },
  rating: {
    color: "#463F2F",
    fontWeight: "600",
    fontSize: 13,
  },
  addToCartButton: {
    backgroundColor: "#463F2F",
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  addedToCartButton: {
    backgroundColor: "#445544",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "white",
    letterSpacing: 0.5,
  },
  addedButtonText: {
    color: "white",
  },
});
