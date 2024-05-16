import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import axios from 'axios';

const MessagesScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/conversation`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then(response => {
                setMessages(response.data.messages);
            })
            .catch(error => console.error('Error fetching conversation:', error));
    }, []);

    const sendMessage = () => {
        setIsLoading(true); // Activer l'indicateur de chargement
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'You', text: newMessage, isSender: true }
        ]);
        axios
            .post(`${BASE_URL}/handleMessage`, { message: newMessage }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then(response => {
              const { response: aiResponse } = response.data;
              setMessages(prevMessages => [
                  ...prevMessages,
                  { sender: 'AI', text: aiResponse, isSender: false }
              ]);
              setIsLoading(false); // Désactiver l'indicateur de chargement
          })
          .catch(error => {
              console.error('Error sending message:', error);
              setIsLoading(false);
          });
          setNewMessage(''); // Effacer le champ de texte
      };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.isSender ? styles.senderMsg : styles.receiverMsg
                    ]}>
                        <Text style={{ color: 'black' }}>
                            {item.text}
                        </Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={isLoading ? (
                    <View style={[styles.messageContainer, styles.receiverMsg]}>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
                ) : null}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={'gray'}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={text => setNewMessage(text)}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    messageContainer: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 20,
        maxWidth: '75%',
        
    },
    senderMsg: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    receiverMsg: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 10,
        color:'black'
    },
});

export default MessagesScreen;
