const calendarService = require('./calendar.service');

const listEvents = async (req, res) => {
  try {
    const events = await calendarService.listEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const id = await calendarService.createEvent(req.body);
    res.json({ success: true, data: { id }, message: 'Event created successfuly' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    await calendarService.updateEvent(req.params.id, req.body);
    res.json({ success: true, message: 'Event updated successfuly' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await calendarService.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted successfuly' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
