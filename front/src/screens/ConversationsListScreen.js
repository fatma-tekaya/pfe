import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { BASE_URL } from '../config'; // Base URL for API requests, imported from a config file.
import axios from 'axios'; // Axios for HTTP requests.
import { AuthContext } from '../context/AuthContext'; // Context to provide authentication data.
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icon package for UI elements.

// Component to display the list of conversations.
const ConversationsListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]); // State to hold list of conversations.
    const { userToken, isLoading, setIsLoading } = useContext(AuthContext); // Auth context that holds the user's token and loading state.

    // Effect hook to fetch conversations when the component mounts.
    useEffect(() => {
        fetchConversations();
    }, []);

    // Asynchronously fetches conversations from the server.
    const fetchConversations = async () => {
        setIsLoading(true); // Set loading state to true during the fetch.
        try {
            const response = await axios.get(`${BASE_URL}/getConversations`, {
                headers: { 'Authorization': `Bearer ${userToken}` } // Include auth token in header.
            });
            setIsLoading(false); // Set loading to false on success.
            setConversations(response.data.conversations); // Update state with fetched conversations.
        } catch (error) {
            setIsLoading(false); // Set loading to false on error.
            console.error('Failed to fetch conversations:', error); // Log error.
        }
    };

    // Handles creation of a new conversation.
    const handleCreateNewChat = async () => {
        setIsLoading(true); // Set loading state to true during the operation.
        try {
            const response = await axios.post(`${BASE_URL}/handleMessage`, { message: "New conversation started." }, {
                headers: { 'Authorization': `Bearer ${userToken}` } // Include auth token in header.
            });
            const newConversationId = response.data.conversationId;
            const newConversation = {
                conversationId: newConversationId,
                title: 'Current Conversation', // or any title you want to set
                lastMessage: 'Tap to continue...'
            };
            setIsLoading(false); // Set loading to false on success.
            setConversations([newConversation, ...conversations]); // Add new conversation to the top of the list
            navigation.navigate('Conversation', { conversationId: newConversationId }); // Navigate to the new conversation screen.
        } catch (error) {
            setIsLoading(false); // Set loading to false on error.
            console.error('Failed to create new chat:', error); // Log error.
        }
    };

    // Function to handle the deletion of a conversation.
    const deleteConversation = async (conversationId) => {
        Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: async () => {
                setIsLoading(true); // Set loading state to true during the deletion.
                try {
                    await axios.delete(`${BASE_URL}/deleteConversation/${conversationId}`, {
                        headers: { 'Authorization': `Bearer ${userToken}` } // Include auth token in header.
                    });
                    setIsLoading(false); // Set loading to false on success.
                    fetchConversations(); // Refresh the list after deletion.
                } catch (error) {
                    setIsLoading(false); // Set loading to false on error.
                    console.error('Failed to delete the conversation:', error); // Log error.
                }
            }}
        ]);
    };

    const renderItem = ({ item }) => {
        const conversationId = item.conversationId?.toString();
        if (!conversationId) {
            console.error('Invalid item encountered', item);
            return null;
        }

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Conversation', { conversationId })}
            >
                <View style={styles.itemContent}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text
                        style={styles.lastMessage}
                        numberOfLines={2}  // Limit text to one line
                        ellipsizeMode="tail"  // Add "..." at the end if the text is too long
                    >
                        {item.lastMessage}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => deleteConversation(conversationId)}>
                    <Ionicons name="trash-bin" size={35} color="red" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    // Main return of the component, displaying the list of conversations.
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleCreateNewChat}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>New Chat</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={item => item.conversationId.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>No conversations found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f3f61',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        minHeight: 80,
        height: 100, // Fixed height as specified in the first style set
        flexDirection: 'row',
        alignItems: 'center',  // Align items vertically in the center
        justifyContent: 'space-between',  // Space between text and delete icon
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop:10
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        flex: 1,  // Allow text to fill the available space
        marginRight: 10,  // Space before the delete icon
    },
    itemContent: {
        flex: 1,  // Allow content to fill available horizontal space
    },
});

export default ConversationsListScreen; // Export the component for use in other parts of the app.
