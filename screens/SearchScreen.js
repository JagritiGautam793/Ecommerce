import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

// Debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const products = route.params?.products || [];

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [debouncedSearchQuery, products]);

  const renderSearchItem = ({ item }) => (
    <Pressable
      style={styles.searchItem}
      onPress={() => navigateToProduct(item)}
    >
      <Image source={{ uri: item.image }} style={styles.searchItemImage} />
      <View style={styles.searchItemInfo}>
        <Text style={styles.searchItemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.searchItemPrice}>${item.price}</Text>
      </View>
    </Pressable>
  );

  const navigateToProduct = (item) => {
    navigation.navigate("Info", {
      id: item.id,
      title: item.title,
      price: item?.price,
      carouselImages: item.image ? [item.image] : [],
      color: item?.color,
      size: item?.size,
      oldPrice: item?.oldPrice,
      item: item,
    });
  };

  return (
    <View style={styles.container}>
      {/* Updated Search Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          {/* <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable> */}

          <View style={styles.searchBar}>
            <View style={styles.searchInputContainer}>
              <AntDesign name="search1" size={22} color="#1f1f1f" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search products"
                placeholderTextColor="gray"
                style={styles.searchInput}
                autoFocus
              />
            </View>
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <AntDesign name="close" size={20} color="#1f1f1f" />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Search Results */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSearchItem}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            {searchQuery.length > 0
              ? "No results found"
              : "Start typing to search"}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },
  headerContainer: {
    backgroundColor: "#F5F4F0",
    paddingTop: 44, // for iOS status bar
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f1f1f",
    paddingVertical: 0, // Remove default padding
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchItemImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 12,
    backgroundColor: "white",
  },
  searchItemInfo: {
    flex: 1,
  },
  searchItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f1f1f",
    marginBottom: 4,
  },
  searchItemPrice: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  noResults: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
    color: "#666",
  },
});

export default SearchScreen;
