const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { isAuth } = require("../middelwares/auth");
const checkRole = require('../middelwares/role');

//patient managing routes
router.post('/signin',  adminController.userSignIn);
router.post("/refresh" ,isAuth, adminController.refresh)
router.get ("/get-users", isAuth , checkRole('admin'), adminController.getAllPatients);
router.post("/create-Patient" , isAuth , checkRole('admin') , adminController.createUser);
router.put('/modif-Patient', isAuth, checkRole('admin'), adminController.modifPatient);
router.delete('/deletePatient/:id', isAuth, checkRole('admin'), adminController.deletePatient);

//docter managing routes
router.get ("/get-doctors", isAuth , checkRole('admin'), adminController.getAllDoctors);
router.post('/create-doctor', isAuth, checkRole('admin'), adminController.createDoctor);
router.put('/modif-Doctor', isAuth, checkRole('admin'), adminController.modifDoctor);
router.delete('/delete-doctor/:id', isAuth, checkRole('admin'), adminController.deleteDoctor);

//Stat managing routes
// Route to get statistics of doctors grouped by their specialty
router.get('/stats/doctors-by-specialty', isAuth, checkRole('admin'), adminController.getDoctorsBySpecialty);
// Route to get the total number of doctors
router.get('/stats/doctor-count', isAuth, checkRole('admin'), adminController.getDoctorCount);
// Route to get the total number of patients
router.get('/stats/patient-count', isAuth, checkRole('admin'), adminController.getPatientCount);
// Route to get patient gender distribution
router.get('/stats/patient-gender',  isAuth, checkRole('admin'),adminController.getPatientGenderDistribution);


module.exports = router;