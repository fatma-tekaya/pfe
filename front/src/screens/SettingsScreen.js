import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button, TextInput } from 'react-native';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [fontSize, setFontSize] = useState("14");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
          value={notificationsEnabled}
        />
      </View>
      
      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={darkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
          value={darkModeEnabled}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Font Size</Text>
        <TextInput
          style={styles.input}
          value={fontSize}
          onChangeText={text => setFontSize(text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Reset Settings"
          color="#0f3f61"
          onPress={() => {
            setNotificationsEnabled(false);
            setDarkModeEnabled(false);
            setFontSize("14");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#20315f'
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10
  },
  settingLabel: {
    fontSize: 18,
    color: '#20315f'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color:'black',
    padding: 10,
    width: 100,
    textAlign: 'center',
    borderRadius: 5
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20
  }
});

export default SettingsScreen;
