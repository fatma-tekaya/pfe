const db = require('../firebase/index');
const express = require('express');

//  update vital signs
exports.updatevitalsigns = async (req, res) => {
    const { email, temp, heartRate, spo2 } = req.body;

    try {
        // Find user by email
        const userRef = db.ref('users');
        const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');

        if (snapshot.exists()) {
            const userId = Object.keys(snapshot.val())[0]; // Get the user ID
            const userVitalsRef = db.ref('users').child(userId).child('vitals');

            await userVitalsRef.update({
                temp,
                heartRate,
                spo2
            });

            res.status(200).json({ success: true, message: 'Vitals updated successfully' });
        } else {
            res.status(404).json( { success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error("Error while updating vitals:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




//  get vital signs
exports.getVitals = async (req, res) => {
    const { email } = req.body;
    try {
        // Find user by email
        const userRef = db.ref('users');
        const snapshot = await userRef.orderByChild('email').equalTo(email).once('value');

        if (snapshot.exists()) {
            const userId = Object.keys(snapshot.val())[0]; // Get the user ID
            const userVitalsRef = db.ref('users').child(userId).child('vitals');

            const vitalsSnapshot = await userVitalsRef.once('value');
            if (vitalsSnapshot.exists()) {
                res.status(200).json({ success: true, vitals: vitalsSnapshot.val() });
            } else {
                res.status(404).json({ success: false, message: 'Vitals not found' });
            }
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error("Error while retrieving vitals:", error);
        res.status(500).json({ success: false, message: "Internal server error" });    }
};
