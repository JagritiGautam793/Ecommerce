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
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductInfoScreen = () => {
  const route = useRoute();
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const height = (width * 100) / 100;
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const item = route.params?.item;
  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: Product information not available</Text>
      </View>
    );
  }
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);

  const handleSearch = () => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setModalVisible(true);
    }
  };

  const navigateToProduct = (item) => {
    navigation.navigate("ProductInfo", {
      id: item.id,
      title: item.title,
      price: item.price,
      carouselImages: item.carouselImages,
      color: item.color,
      size: item.size,
      oldPrice: item.oldPrice,
      item: item,
    });
    setModalVisible(false);
    setSearchQuery("");
  };

  const isApiProduct = !item.carouselImages;
  const carouselImages = isApiProduct ? [item.image] : item.carouselImages;

  return (
    <ScrollView
      style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: "#00CED1",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => navigateToProduct(item)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput
            placeholder="Search Amazon"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </Pressable>
        <Feather name="mic" size={24} color="black" />
      </View>

      {isApiProduct ? (
        // New section for API products
        <View style={styles.apiProductContainer}>
          <Image source={{ uri: item.image }} style={styles.apiProductImage} />
          <View style={styles.apiProductDetails}>
            <Text style={styles.apiProductTitle}>{item.title}</Text>
            <Text style={styles.apiProductPrice}>₹{item.price}</Text>
            <Text style={styles.apiProductDescription}>{item.description}</Text>
            <Text style={styles.apiProductCategory}>
              Category: {item.category}
            </Text>
            <View style={styles.apiProductRating}>
              <Text>
                Rating: {item.rating.rate} ({item.rating.count} reviews)
              </Text>
            </View>
          </View>
        </View>
      ) : (
        // Existing section for array products
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {carouselImages.map((item, index) => (
              <ImageBackground
                key={index}
                source={{ uri: item }}
                style={{
                  width,
                  height,
                  marginTop: 25,
                  resizeMode: "contain",
                }}
              >
                <View
                  style={{
                    padding: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#C60C30",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    >
                      20 % OFF
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#E0E0E0",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="share-variant"
                      size={24}
                      color="black"
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginTop: "auto",
                    marginLeft: 20,
                    marginBottom: 20,
                  }}
                >
                  <AntDesign name="hearto" size={24} color="black" />
                </View>
              </ImageBackground>
            ))}
          </ScrollView>

          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              {item.title}
            </Text>

            <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
              ₹{item.price}
            </Text>
          </View>

          <Text style={{ height: 1, borderColor: "D0D0D0", borderWidth: 1 }} />

          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Text>Color:</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.color}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Text>Size:</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.size}
            </Text>
          </View>
        </>
      )}

      <Text style={{ height: 1, borderColor: "D0D0D0", borderWidth: 1 }} />

      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
          Total : ₹{item.price}
        </Text>
        <Text style={{ color: "#00CED1" }}>
          FREE DELIVERY TOMORROW BY 3 PM .Order within 10 hrs 30 mins
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            alignItems: "center",
            gap: 5,
          }}
        >
          <Ionicons name="location" size={24} color="black" />
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            Deliver To Jagriti-Gurgaon 122001
          </Text>
        </View>
      </View>

      <Text style={{ color: "green", marginHorizontal: 10, fontWeight: "500" }}>
        In Stock
      </Text>

      <Pressable
        onPress={() => addItemToCart(item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text>Added to cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "#FFAC1C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text>Buy Now</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  apiProductContainer: {
    padding: 10,
  },
  apiProductImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  apiProductDetails: {
    marginTop: 10,
  },
  apiProductTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  apiProductPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B12704",
    marginBottom: 5,
  },
  apiProductDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  apiProductCategory: {
    fontSize: 14,
    color: "#007185",
    marginBottom: 5,
  },
  apiProductRating: {
    flexDirection: "row",
    alignItems: "center",
  },
});
