// NotifScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as needed

const NotifScreen = ({ setUnseenCount }) => {
  const { userInfo } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    const fetchNotifications = (userId) => {
      unsubscribe = firestore()
        .collection('notifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const fetchedNotifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setNotifications(fetchedNotifications);
          setLoading(false);

          // Calculate the number of unseen notifications
          const unseen = fetchedNotifications.filter(notification => !notification.seen).length;
          setUnseenCount(unseen);

          // Mark all unseen notifications as seen
          markNotificationsAsSeen(fetchedNotifications);
        });
    };

    const markNotificationsAsSeen = (notifications) => {
      notifications.forEach(notification => {
        if (!notification.seen) {
          firestore().collection('notifications').doc(notification.id).update({ seen: true });
        }
      });
    };

    const fetchUserId = async () => {
      try {
        const snapshot = await database()
          .ref('patients')
          .orderByChild('email')
          .equalTo(userInfo.user.email)
          .once('value');

        if (snapshot.exists()) {
          const userId = Object.keys(snapshot.val())[0];
          fetchNotifications(userId);
        } else {
          console.error('No user found with the provided email.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setLoading(false);
      }
    };

    if (userInfo.user.email) {
      fetchUserId();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userInfo]);

  const deleteNotification = async (id) => {
    try {
      await firestore().collection('notifications').doc(id).delete();
      setNotifications(notifications.filter(notification => notification.id !== id));
      setUnseenCount(prevCount => prevCount - 1); // Update the unseen count
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={{color:'#888'}}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.createdAt.toDate()).toLocaleString()}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{color:'black'}}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    color:'#888',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative'
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    color: '#888'
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  }
});

export default NotifScreen;
