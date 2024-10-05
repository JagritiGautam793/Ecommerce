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

    // Clean up the timeout if the value changes (before the delay finishes)
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

  // Use the debounced search query with a delay of 500ms
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // UseEffect to handle the search logic with the debounced value
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
      <View style={styles.searchContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* <AntDesign name="arrowleft" size={24} color="black" /> */}
        </Pressable>
        <View style={styles.searchBar}>
          <AntDesign
            style={styles.searchIcon}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Amazon"
            autoFocus
          />
        </View>
      </View>
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
    marginTop: 40,
    backgroundColor: "white",
  },
  searchContainer: {
    backgroundColor: "#00CED1",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 3,
    height: 38,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchItemImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  searchItemInfo: {
    flex: 1,
  },
  searchItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchItemPrice: {
    fontSize: 14,
    color: "#888",
  },
  noResults: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default SearchScreen;
