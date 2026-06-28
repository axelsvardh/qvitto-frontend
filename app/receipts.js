import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import api from "../api/api";

export default function ReceiptsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("SEK");

  // hämta alla kvitton
  const getData = async () => {
    try {
      const res = await api.get("/api/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // skapa nytt kvitto
  const createTransaction = async () => {
    if (!merchant || !amount) return;
    try {
      await api.post("/api/transactions", {
        merchant,
        amount: parseFloat(amount),
        currency,
      });
      setMerchant("");
      setAmount("");
      await getData(); // uppdatera listan
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 5000); // hämta var 5:e sekund
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lägg till nytt kvitto</Text>
      <TextInput
        placeholder="Butik (t.ex. ICA)"
        value={merchant}
        onChangeText={setMerchant}
        style={styles.input}
      />
      <TextInput
        placeholder="Belopp"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Spara kvitto" onPress={createTransaction} />

      <Text style={styles.title}>Mina kvitton</Text>
      <Button title="Uppdatera lista" onPress={getData} />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.merchant}</Text>
            <Text>{item.amount} {item.currency}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:"#fff" },
  title:{ fontWeight:"bold", marginTop:15, marginBottom:5, fontSize:16 },
  input:{ borderWidth:1, padding:10, marginBottom:8, borderColor:"#ccc" },
  item:{ borderBottomWidth:0.5, borderColor:"#ddd", paddingVertical:8 },
  itemTitle:{ fontWeight:"600" }
});
