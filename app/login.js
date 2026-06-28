import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/receipts");
    } catch (err) {
      console.log("LOGIN ERROR:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input}/>
      <TextInput placeholder="Lösenord" secureTextEntry value={password} onChangeText={setPassword} style={styles.input}/>
      <Button title="Logga in" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => router.push("/register")}>
        Skapa konto
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", padding:20 },
  input:{ borderWidth:1, padding:10, marginVertical:5 },
  link:{ color:"blue", marginTop:10, textAlign:"center" }
});
