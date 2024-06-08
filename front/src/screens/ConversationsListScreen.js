import React, { useEffect, useState, useContext } from 'react';
import { View, Image, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BASE_URL } from '../config';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

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
            const newConversation = {
                conversationId: newConversationId,
                title: 'Current Conversation',
                lastMessage: 'Tap to continue...'
            };
            setIsLoading(false);
            setConversations([newConversation, ...conversations]);
            navigation.navigate('Conversation', { conversationId: newConversationId });
        } catch (error) {
            setIsLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Failed to create new chat',
                text1Style: { fontSize: 14 },
                text2Style: { fontSize: 14 }
            });
            console.error('Failed to create new chat:', error);
        }
    };

    const deleteConversation = async (conversationId) => {
        Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", onPress: async () => {
                    setIsLoading(true);
                    try {
                        await axios.delete(`${BASE_URL}/deleteConversation/${conversationId}`, {
                            headers: { 'Authorization': `Bearer ${userToken}` }
                        });
                        setIsLoading(false);
                        fetchConversations();
                        Toast.show({
                            type: 'success',
                            text1: 'Delete Conversation',
                            text2: 'Your conversation deleted successfully',
                            text1Style: { fontSize: 14 },
                            text2Style: { fontSize: 14 }
                        });
                    } catch (error) {
                        setIsLoading(false);
                        Toast.show({
                            type: 'error',
                            text1: 'Delete Conversation',
                            text2: 'Your conversation not deleted',
                            text1Style: { fontSize: 14 },
                            text2Style: { fontSize: 14 }
                        });
                        console.error('Failed to delete the conversation:', error);
                    }
                }
            }
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
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.lastMessage}
                    </Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteConversation(conversationId)}>
                    <Entypo name="cross" size={20} color="gray" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleCreateNewChat}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>New Chat</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={item => item.conversationId.toString()}
                ListEmptyComponent={
                    <View style={globalStyles.emptyContainer}>
                        <Image
                            source={require('../assets/images/robot.gif')}
                            style={globalStyles.emptyGif}
                        />
                        <Text style={globalStyles.emptyText}>Let's start a new chat to assist you!</Text>
                    </View>
                }
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
        backgroundColor: '#008ef7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginBottom: '20%',
    },

    addButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Outfit-Light',
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
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Outfit-Regular',
        color: '#333',
        marginTop: 10,
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 10,
    },
    itemContent: {
        flex: 1,
    },
    
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

});

export default ConversationsListScreen;
