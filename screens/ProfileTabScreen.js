import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useLayoutEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const API_BASE_URL = "http://192.168.29.229:8000";
const CACHE_KEYS = {
  USER_PROFILE: "userProfile",
  AUTH_TOKEN: "authToken",
  ORDERS: (userId) => `orders_${userId}`,
};

const useProfile = (userId) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const cachedUser = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE);
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${API_BASE_URL}/profile/${userId}`);
      setUser(data.user);
      await AsyncStorage.setItem(
        CACHE_KEYS.USER_PROFILE,
        JSON.stringify(data.user)
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  return { user, loading };
};

const useOrders = (userId) => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const cachedOrders = await AsyncStorage.getItem(
        CACHE_KEYS.ORDERS(userId)
      );
      if (cachedOrders) {
        setOrders(JSON.parse(cachedOrders));
        setLoading(false);
        return;
      }

      const { data } = await axios.get(`${API_BASE_URL}/orders/${userId}`);
      setOrders(data.orders);
      await AsyncStorage.setItem(
        CACHE_KEYS.ORDERS(userId),
        JSON.stringify(data.orders)
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  return { orders, loading };
};

const HeaderIcons = () => (
  <View style={styles.headerRight}>
    <Pressable style={styles.headerIcon}>
      <Ionicons name="notifications-outline" size={24} color="black" />
    </Pressable>
    <Pressable style={styles.headerIcon}>
      <AntDesign name="search1" size={24} color="black" />
    </Pressable>
  </View>
);

const ProfileHeader = ({ user }) => (
  <View style={[styles.profileHeader, styles.elevatedCard]}>
    <View style={styles.avatarContainer}>
      <Text style={styles.avatarText}>
        {user?.name?.charAt(0)?.toUpperCase()}
      </Text>
    </View>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.userEmail}>{user?.email}</Text>
    </View>
  </View>
);

const ProfileOption = ({ icon, title, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.profileOption,
      styles.elevatedCard,
      pressed && styles.profileOptionPressed,
    ]}
  >
    {icon}
    <Text style={styles.optionText}>{title}</Text>
  </Pressable>
);

const OrderCard = ({ order }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const calculateItemTotal = (product) => {
    const quantity = product.quantity || 1;
    const price = parseFloat(product.price);
    return (quantity * price).toFixed(2);
  };

  const totalAmount = order.products.reduce((sum, product) => {
    return sum + parseFloat(calculateItemTotal(product));
  }, 0);

  return (
    <View style={[styles.orderCard, styles.elevatedCard]}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderDate}>Ordered on {orderDate}</Text>
          <Text style={styles.orderTotal}>
            Total: ₹{totalAmount.toFixed(2)}
          </Text>
        </View>
        <Text style={styles.orderStatus}>Delivered</Text>
      </View>

      <View style={styles.orderProducts}>
        {order.products.map((product) => (
          <View key={product._id} style={styles.productInfo}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text numberOfLines={2} style={styles.productName}>
                {product.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>
                  ₹{product.price} × {product.quantity || 1}
                </Text>
                <Text style={styles.itemTotal}>
                  ₹{calculateItemTotal(product)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const OrdersSection = ({ orders, loading }) => (
  <View style={styles.ordersSection}>
    <Text style={styles.sectionTitle}>Recent Orders</Text>
    {loading ? (
      <ActivityIndicator size="large" color="#00CED1" style={styles.loader} />
    ) : orders.length > 0 ? (
      <View>
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </View>
    ) : (
      <View style={[styles.noOrdersContainer, styles.elevatedCard]}>
        <MaterialIcons name="shopping-cart" size={40} color="#888" />
        <Text style={styles.noOrdersText}>No orders found</Text>
        <Text style={styles.noOrdersSubtext}>Your orders will appear here</Text>
      </View>
    )}
  </View>
);

const ProfileTabScreen = () => {
  const { userId } = React.useContext(UserType);
  const navigation = useNavigation();
  const { user, loading: userLoading } = useProfile(userId);
  const { orders, loading: ordersLoading } = useOrders(userId);

  const logout = async () => {
    await AsyncStorage.removeItem(CACHE_KEYS.AUTH_TOKEN);
    await AsyncStorage.multiRemove([
      CACHE_KEYS.USER_PROFILE,
      CACHE_KEYS.ORDERS(userId),
    ]);
    navigation.replace("Login");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#F5F4F0",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: "white",
      headerRight: () => <HeaderIcons />,
    });
  }, [navigation]);

  const profileOptions = [
    {
      icon: <MaterialIcons name="shopping-bag" size={24} color="#445544" />,
      title: "Your Orders",
    },
    {
      icon: <MaterialIcons name="account-circle" size={24} color="#445544" />,
      title: "Your Account",
    },
    {
      icon: <MaterialIcons name="replay" size={24} color="#445544" />,
      title: "Buy Again",
    },
    {
      icon: <MaterialIcons name="logout" size={24} color="#445544" />,
      title: "Logout",
      onPress: logout,
    },
  ];

  if (userLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00CED1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ProfileHeader user={user} />

      <View style={styles.optionsGrid}>
        {profileOptions.map((option, index) => (
          <ProfileOption key={index} {...option} />
        ))}
      </View>

      <OrdersSection orders={orders} loading={ordersLoading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F4F0",
  },
  elevatedCard: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#463F2F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    marginHorizontal: 4,
  },
  profileOption: {
    width: (width - 40) / 2,
    padding: 15,
    margin: 4,
    alignItems: "center",
  },
  profileOptionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  ordersSection: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
    paddingHorizontal: 4,
  },
  orderCard: {
    marginBottom: 16,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  orderProducts: {
    padding: 16,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  noOrdersContainer: {
    padding: 32,
    alignItems: "center",
    margin: 4,
  },
  noOrdersText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  noOrdersSubtext: {
    marginTop: 4,
    color: "#999",
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
});

export default ProfileTabScreen;
