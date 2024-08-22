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
                lastMessage: 'Tap to continue...',
                createdAt: new Date().toISOString() // Set the current time for the new conversation
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
    
        const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Now';
    
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('Conversation', { conversationId })}
            >
                <View style={styles.itemContent}>
                   
                    <Text
                        style={styles.lastMessage}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item.lastMessage}
                    </Text>
                    <Text style={styles.timestamp}>{createdAt}</Text>
              
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteConversation(conversationId)}>
                    <Entypo name="cross" size={25} color="gray" />
                </TouchableOpacity>
                </View>
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
                        <Text style={{  fontFamily: 'Outfit-Light',
        fontSize: 20,
        color: colors.bleu,
        textAlign: 'center',
        marginTop: -110}}>   Let’s start a new chat and address your       health concerns together!   </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: colors.bleu_bleu, // Use the color from your colors file
       
        borderRadius: 10,
        elevation: 3, // Add some shadow/elevation for better UI
      },
      loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Outfit-Medium',
        textAlign: 'center', // Center align the button text
      },
    container: {
        flex: 1,
        marginTop: 20,
    },
    timestamp: {
        marginTop: 4,
        fontSize: 12,
        color: '#888'
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
        paddingHorizontal: 10,
        borderRadius: 30,
        marginTop: '5%',
        marginBottom: '5%',
    },

    addButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
        fontFamily: 'Outfit-Light',
    },
    item: {
        borderRadius: 8,
        color:'#888',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
       position: 'relative',


        backgroundColor: '#f8f8f8',
        paddingHorizontal: 10,
        paddingVertical: 18,
        marginVertical: 5,
        marginHorizontal: 10,
          // position: 'relative',
        minHeight: 60,
       // height: 80,
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
      paddingVertical:0,
        marginVertical: 2,
        marginHorizontal: 5,
    },
    itemContent: {
        flex: 1,
        direction:'row',
        justifyContent: 'space-between',
    },
    
    deleteButton: {
        position: 'absolute',
       marginTop:-15,
        marginLeft:350
    },

});

export default ConversationsListScreen;
