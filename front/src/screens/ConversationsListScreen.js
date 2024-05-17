import React, { useEffect, useState, useContext } from 'react';
import { BASE_URL } from '../config';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ConversationsListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const { userToken, isLoading, setIsLoading } = useContext(AuthContext);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/getConversations`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            setIsLoading(false);
            setConversations(response.data.conversations);
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to fetch conversations:', error);
        }
    };

    const handleCreateNewChat = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/handleMessage`, { message: "New conversation started." }, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            const newConversationId = response.data.conversationId;
            setIsLoading(false);
            navigation.navigate('Conversation', { conversationId: newConversationId });
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to create new chat:', error);
        }
    };

    const deleteConversation = async (conversationId) => {
        Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: async () => {
                setIsLoading(true);
                try {
                    await axios.delete(`${BASE_URL}/deleteConversation/${conversationId}`, {
                        headers: { 'Authorization': `Bearer ${userToken}` }
                    });
                    setIsLoading(false);
                    fetchConversations(); // Refresh the list after deletion
                } catch (error) {
                    setIsLoading(false);
                    console.error('Failed to delete the conversation:', error);
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
                    <Text style={{ color: 'black' }}>{item.lastMessage}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteConversation(conversationId)}>
                    <Ionicons name="trash-bin" size={44} color="red" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

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
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#f8f8f8',
        paddingVertical: 15,
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
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    itemContent: {
        flex: 1, // Ajout pour aligner le texte et l'icône de suppression
    },
});

export default ConversationsListScreen;
