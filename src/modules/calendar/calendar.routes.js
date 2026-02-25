const express = require('express');
const router = express.Router();
const calendarController = require('./calendar.controller');

router.get('/list', calendarController.listEvents);
router.post('/create', calendarController.createEvent);
router.put('/update/:id', calendarController.updateEvent);
router.delete('/delete/:id', calendarController.deleteEvent);

module.exports = router;
