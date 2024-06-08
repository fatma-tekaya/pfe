const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { isAuth } = require("../middelwares/auth");
const checkRole = require('../middelwares/role');


router.post('/signin',  adminController.userSignIn);
// Route to create a doctor account
router.post('/create-doctor', isAuth, checkRole('admin'), adminController.createDoctor);

// Route to delete a doctor account
router.delete('/delete-doctor/:doctorId', isAuth, checkRole('admin'), adminController.deleteDoctor);

// Route to get statistics of doctors grouped by their specialty
router.get('/stats/doctors-by-specialty', isAuth, checkRole('admin'), adminController.getDoctorsBySpecialty);

// Route to get the total number of doctors
router.get('/stats/doctor-count', isAuth, checkRole('admin'), adminController.getDoctorCount);

// Route to get the total number of patients
router.get('/stats/patient-count', isAuth, checkRole('admin'), adminController.getPatientCount);

module.exports = router;