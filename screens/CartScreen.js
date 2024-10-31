import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import React, { useRef, useState, useCallback, memo } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const SearchBar = memo(() => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <View
      style={{
        backgroundColor: "#F5F4F0",
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 45,
            flex: 1,
            marginRight: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <AntDesign name="search1" size={20} color="#999" />
          <TextInput
            ref={inputRef}
            placeholder="Search Amazon"
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 16,
              color: "#333",
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor="#999"
          />
          {isFocused && (
            <Pressable onPress={() => inputRef.current?.blur()}>
              <AntDesign name="close" size={20} color="#999" />
            </Pressable>
          )}
        </View>
        <Pressable
          style={{
            width: 45,
            height: 45,
            borderRadius: 23,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Feather name="mic" size={22} color="#333" />
        </Pressable>
      </View>
    </View>
  );
});

const CartItem = memo(({ item, onIncrement, onDecrement, onDelete }) => (
  <View
    style={{
      backgroundColor: "white",
      marginVertical: 8,
      borderBottomColor: "#F0F0F0",
      borderWidth: 2,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
      padding: 10,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Image
        style={{
          width: 120,
          height: 120,
          resizeMode: "contain",
        }}
        source={{ uri: item?.image }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 10,
        }}
      >
        <Text
          numberOfLines={3}
          style={{
            fontSize: 16,
          }}
        >
          {item?.title}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 6,
          }}
        >
          ₹{item?.price}
        </Text>
        <Text style={{ color: "green" }}>In Stock</Text>
      </View>
    </View>

    <View
      style={{
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#D0D0D0",
          borderRadius: 7,
        }}
      >
        {item.quantity > 1 ? (
          <Pressable
            onPress={() => onDecrement(item)}
            style={{
              backgroundColor: "#D8D8D8",
              padding: 7,
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
            }}
          >
            <AntDesign name="minus" size={20} color="black" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => onDelete(item)}
            style={{
              backgroundColor: "#D8D8D8",
              padding: 7,
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
            }}
          >
            <AntDesign name="delete" size={20} color="black" />
          </Pressable>
        )}

        <Text
          style={{
            paddingHorizontal: 18,
            paddingVertical: 6,
            fontSize: 16,
          }}
        >
          {item?.quantity}
        </Text>

        <Pressable
          onPress={() => onIncrement(item)}
          style={{
            backgroundColor: "#D8D8D8",
            padding: 7,
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
          }}
        >
          <Feather name="plus" size={20} color="black" />
        </Pressable>
      </View>

      <Pressable
        onPress={() => onDelete(item)}
        style={{
          backgroundColor: "#463F2F",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderRadius: 5,
          borderColor: "#C0C0C0",
          borderWidth: 0.6,
        }}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </Pressable>
    </View>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 15,
      }}
    >
      <Pressable
        style={{
          backgroundColor: "#445544",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderRadius: 5,
          borderColor: "#C0C0C0",
          borderWidth: 0.6,
        }}
      >
        <Text style={{ color: "white" }}>Save For Later</Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: "#445544",
          paddingHorizontal: 8,
          paddingVertical: 10,
          borderRadius: 5,
          borderColor: "#C0C0C0",
          borderWidth: 0.6,
        }}
      >
        <Text style={{ color: "white" }}>See more like this</Text>
      </Pressable>
    </View>
  </View>
));

const CartScreen = () => {
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const total = useCallback(
    () => cart?.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handleIncrement = useCallback(
    (item) => {
      dispatch(incrementQuantity(item));
    },
    [dispatch]
  );

  const handleDecrement = useCallback(
    (item) => {
      dispatch(decrementQuantity(item));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (item) => {
      dispatch(removeFromCart(item));
    },
    [dispatch]
  );

  return (
    <ScrollView
      style={{
        marginTop: 55,
        flex: 1,
        backgroundColor: "#F5F4F0",
      }}
    >
      <SearchBar />

      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "400",
          }}
        >
          Subtotal:{" "}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          ₹{total()}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          padding: 10,
          backgroundColor: "#A9BA9D",
        }}
      >
        <Text
          style={{
            marginHorizontal: 10,
            flex: 1,
            fontSize: 14,
          }}
        >
          EMI details Available
        </Text>
      </View>

      <Pressable
        onPress={() => navigation.navigate("Confirm")}
        style={{
          backgroundColor: "#463F2F",
          padding: 10,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Proceed to Buy ({cart.length} items)
        </Text>
      </Pressable>

      <View
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 16,
        }}
      />

      <View
        style={{
          marginHorizontal: 10,
        }}
      >
        {cart?.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onDelete={handleDelete}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;
