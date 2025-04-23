import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import debounce from "lodash/debounce";
import FlyingBag from "../components/FlyingBag";

const { width } = Dimensions.get("window");
const height = (width * 100) / 100;

const ProductInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const [addedToCart, setAddedToCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchAnimation] = useState(new Animated.Value(0));

  const [showFlyingBag, setShowFlyingBag] = useState(false);

  const item = route.params?.item;

  const addItemToCart = useCallback(
    (item) => {
      setAddedToCart(true);
      dispatch(addToCart(item));
      setTimeout(() => setAddedToCart(false), 60000);

      setShowFlyingBag(true);
    },
    [dispatch]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((text) => {
        if (text) {
          // Implement search logic here
        }
      }, 300),
    []
  );

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    Animated.spring(searchAnimation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
    Animated.spring(searchAnimation, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, []);

  const searchBarStyle = useMemo(
    () => ({
      transform: [
        {
          scale: searchAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.02],
          }),
        },
      ],
    }),
    [searchAnimation]
  );

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: Product information not available</Text>
      </View>
    );
  }

  const isApiProduct = !item.carouselImages;
  const carouselImages = isApiProduct ? [item.image] : item.carouselImages;

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Animated.View style={[styles.searchBarWrapper, searchBarStyle]}>
            <Pressable
              onPress={() => navigation.navigate("ProductInfo", item)}
              style={[
                styles.searchBar,
                isSearchFocused && styles.searchBarFocused,
              ]}
            >
              <AntDesign
                style={styles.searchIcon}
                name="search1"
                size={22}
                color={isSearchFocused ? "#000" : "#666"}
              />
              <TextInput
                placeholder="Search Amazon"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  debouncedSearch(text);
                }}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                style={styles.searchInput}
              />
            </Pressable>
            <Pressable style={styles.micButton}>
              <Feather name="mic" size={24} color="black" />
            </Pressable>
          </Animated.View>
        </View>

        {/* Product Images Section */}
        {isApiProduct ? (
          <View style={styles.apiProductContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.apiProductImage}
            />
          </View>
        ) : (
          <View style={styles.carouselContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {carouselImages.map((image, index) => (
                <ImageBackground
                  key={index}
                  source={{ uri: image }}
                  style={styles.carouselImage}
                >
                  <View style={styles.carouselOverlay}>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>20% OFF</Text>
                    </View>
                    <View style={styles.shareBadge}>
                      <MaterialCommunityIcons
                        name="share-variant"
                        size={24}
                        color="black"
                      />
                    </View>
                  </View>
                  <View style={styles.heartBadge}>
                    <AntDesign name="hearto" size={24} color="black" />
                  </View>
                </ImageBackground>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Overlay Container with All Details */}
      <View style={styles.overlayContainer}>
        <ScrollView style={styles.overlayScroll}>
          <View style={styles.detailsContainer}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={{ flexDirection: "row", gap: 120 }}>
              <Text style={styles.totalPrice}>Total: ₹{item.price}</Text>
              <Text style={styles.stockInfo}>In Stock</Text>
            </View>

            {/* Product Attributes in Row */}
            <View style={styles.attributesRow}>
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Color</Text>
                <Text style={styles.attributeValue}>{item.color}</Text>
              </View>
              <View style={styles.attributeDivider} />
              <View style={styles.attributeItem}>
                <Text style={styles.attributeLabel}>Size</Text>
                <Text style={styles.attributeValue}>{item.size}</Text>
              </View>
            </View>

            {/* Condensed API Product Details */}
            {isApiProduct && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={styles.deliverySection}>
              <Ionicons name="location" size={18} color="#2F76E5" />
              <Text style={styles.deliveryText}>
                Deliver tomorrow by 3 PM to Gurgaon 122001
              </Text>
            </View>

            {/* <Text style={styles.stockInfo}>In Stock</Text> */}
          </View>
        </ScrollView>

        {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => addItemToCart(item)}
            style={[styles.button, styles.addToCartButton]}
          >
            <Text style={styles.buttonText}>
              {addedToCart ? "Added to cart" : "Add to Cart"}
            </Text>
          </Pressable>

          <Pressable style={[styles.button, styles.buyNowButton]}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </Pressable>

          {showFlyingBag && (
            <FlyingBag
              triggerAnimation={true}
              onFinish={() => setShowFlyingBag(false)}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },
  container: {
    marginTop: 40,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    backgroundColor: "#F5F4F0",
    padding: 10,
    zIndex: 1,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchBarFocused: {
    backgroundColor: "#fff",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
  },
  micButton: {
    width: 42,
    height: 42,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  carouselContainer: {
    marginBottom: 5,
    // borderRadius: 50,
  },
  carouselImage: {
    width,
    height,
    // marginTop: 2,
    resizeMode: "contain",
  },
  carouselOverlay: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C60C30",
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },
  shareBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  heartBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginLeft: 20,
    marginBottom: 50,
  },
  apiProductContainer: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  apiProductImage: {
    width: "100%",
    height: 360,
    resizeMode: "contain",
    backgroundColor: "white",
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    height: "39%", // Reduced from 60% to 45%
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  overlayScroll: {
    flex: 1,
    marginBottom: 70,
  },
  detailsContainer: {
    padding: 15,
  },
  productTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
    color: "#000",
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  attributesRow: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 3,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  attributeItem: {
    flex: 1,
    alignItems: "center",
  },
  attributeDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  attributeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  deliverySection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 6,
    borderRadius: 8,
    marginBottom: 2,
  },
  deliveryText: {
    fontSize: 14,
    color: "#2F76E5",
    marginLeft: 8,
    flex: 1,
  },
  stockInfo: {
    color: "#00a650",
    fontWeight: "500",
    fontSize: 14,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flex: 0.485,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addToCartButton: {
    backgroundColor: "#463F2F",
  },
  buyNowButton: {
    backgroundColor: "#445544",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});

export default ProductInfoScreen;
