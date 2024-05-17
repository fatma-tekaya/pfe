import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BASE_URL } from '../config';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ConversationScreen = ({ route }) => {
    const { conversationId } = route.params;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { userToken } = useContext(AuthContext);

    useEffect(() => {
        fetchMessages();
    }, [userToken, conversationId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getConversation/${conversationId}`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = {
                _id: Date.now().toString(),
                text: input,
                isSender: true,
                isLoading: true
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInput('');

            try {
                const response = await axios.post(`${BASE_URL}/handleMessage/${conversationId}`, { message: input }, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                console.log('Response from sendMessage:', response.data);

                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg._id === newMessage._id ? { ...msg, isLoading: false } : msg
                    ).concat({
                        _id: Date.now().toString(),
                        text: response.data.response,
                        isSender: false
                    })
                );

            } catch (error) {
                console.error('Error sending message:', error);
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg._id === newMessage._id ? { ...msg, isLoading: false } : msg
                    )
                );
            }
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.isSender ? styles.sender : styles.receiver]}>
                        <Text style={styles.text}>{item.text}</Text>
                        {item.isLoading && <ActivityIndicator size="small" color="#0000ff" />}
                    </View>
                )}
                keyExtractor={item => item._id}
                contentContainerStyle={{ paddingBottom: 10 }}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor="gray"
                    value={input}
                    onChangeText={setInput}
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    message: {
        padding: 10,
        borderRadius: 10,
        margin: 5,
        maxWidth: '80%',
    },
    text: {
        color: 'black'
    },
    sender: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    receiver: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc'
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderRadius: 10,
        padding: 10,
        color: 'black'
    }
});

export default ConversationScreen;
