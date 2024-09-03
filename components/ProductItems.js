import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductItems = ({ item }) => {  
  const [addedToCart,setAddedToCart]=useState(false); 
  const dispatch=useDispatch();
  const addItemToCart=(item)=>{ 
    setAddedToCart(true);
    dispatch(addToCart(item)) 
    setTimeout(()=>{ 
      setAddedToCart(false)

    },60000)

  }
  return (
    <Pressable style={{ width:"48%", marginVertical: 10 }}>
      <Image
        style={{ width: "100%", height: 150, resizeMode: "contain" }}
        source={{ uri: item?.image }}
      />
      <Text numberOfLines={1} style={{ marginTop: 10 }}>
        {item?.title}
      </Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹{item?.price}</Text>
        <Text style={{ color: "#FFC72C", fontWeight: "bold" }}>
          {item?.rating?.rate} ratings
        </Text>
      </View>

      <Pressable 
      onPress={()=>addItemToCart(item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center", 
          alignItems:"center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
       {addedToCart?(
        <View> 
          <Text>Added To Cart</Text>
        </View> 
       ):( 
        <Text>Add to Cart</Text>
       )}
      </Pressable>
    </Pressable>
  );
};

export default ProductItems;

const styles = StyleSheet.create({});
