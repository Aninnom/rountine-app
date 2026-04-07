import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native"

export default function App() {
  const [routines, setRoutines] = useState([])
  const [input, setInput] = useState("")

  function addRoutine() {
    if (input === "") return
    setRoutines([...routines, { id: Date.now(), name: input }])
    setInput("")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 루틴 나무</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="새 루틴 입력..."
        />
        <TouchableOpacity style={styles.button} onPress={addRoutine}>
          <Text style={styles.buttonText}>추가</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>🌱 {item.name}</Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: "#f4f9f0" },
  title:     { fontSize: 28, fontWeight: "bold", color: "#2d6a4f", marginBottom: 20 },
  inputWrap: { flexDirection: "row", gap: 8, marginBottom: 20 },
  input:     { flex: 1, borderWidth: 1, borderColor: "#c8ddd0", borderRadius: 10, padding: 10, fontSize: 14 },
  button:    { backgroundColor: "#2d6a4f", padding: 10, borderRadius: 10, justifyContent: "center" },
  buttonText:{ color: "white", fontWeight: "bold" },
  item:      { fontSize: 15, padding: 14, backgroundColor: "white", borderRadius: 12, marginBottom: 10 },
})