import React, { useState, useEffect, useContext } from 'react';
import {
  View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Assurez-vous d'avoir installé cette bibliothèque.
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';

const ConversationScreen = ({ route }) => {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    fetchMessages();
  }, [userToken, conversationId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getConversation/${conversationId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
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
        senderName: 'You',
        receiverName: 'AI', 
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      setIsLoadingResponse(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/handleMessage/${conversationId}`,
          { message: input },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setMessages(prevMessages => [...prevMessages, {
          _id: Date.now().toString(),
          text: response.data.response,
          isSender: false,
          senderName: 'AI',
          receiverName: 'You',
        }]);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoadingResponse(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.isSender ? styles.senderContainer : styles.receiverContainer]}>
            <View style={[styles.message, item.isSender ? styles.sender : styles.receiver]}>
              <Text style={styles.text}>
                <Text style={styles.name}>{item.isSender ? 'You: ' : 'AI: '}</Text>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={item => item._id}
        ListFooterComponent={
          isLoadingResponse && <ActivityIndicator size="small" color="#0000ff" />
        }
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
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  senderContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  receiverContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  message: {
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
    elevation: 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  text: {
    color: '#333',
    fontSize: 16,
  },
  sender: {
    backgroundColor: '#DCF8C6',
  },
  receiver: {
    backgroundColor: '#ECECEC',
  },
  name: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  sendButton: {
    backgroundColor: '#0078D7',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConversationScreen;
