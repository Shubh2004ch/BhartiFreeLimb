const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const upload = require('../middleware/upload');

router.get('/', clinicController.getAllClinics);
router.post('/', upload.single('image'), clinicController.createClinic);
router.put('/:id', upload.single('image'), clinicController.updateClinic);
router.delete('/:id', clinicController.deleteClinic);

module.exports = router; 