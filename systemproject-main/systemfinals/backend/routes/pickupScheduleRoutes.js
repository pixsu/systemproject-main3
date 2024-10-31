const express = require('express');
const router = express.Router();
const PickupSchedule = require('../models/pickupSchedule'); // Adjust path as necessary

// Endpoint to fetch dates with available slots
router.get('/available-dates', async (req, res) => {
    try {
        console.log('Fetching available dates from MongoDB...');
      const availableDates = await PickupSchedule.find({ slots: { $gt: 0 } }, 'date slots');
      console.log('Available dates fetched:', availableDates);
      res.json(availableDates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching available dates', error });
    }
  });

router.post('/deduct-slots', async (req, res) => {
    const { date } = req.body;

    try {
        const result = await PickupSchedule.findOneAndUpdate(
            { date: new Date(date), slots: { $gt: 0 } }, // Ensure slots are available
            { $inc: { slots: -1 } }, // Deduct a slot
            { new: true } // Return the updated document
        );

        if (!result || result.slots <= 0) {
            res.status(400).json({ message: 'No available slots for this date' });
        } else {
            res.json({ message: 'Slot deducted successfully', slotsRemaining: result.slots });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to deduct slot', error });
    }
});

router.post('/update-slots', async (req, res) => {
    
    const { date } = req.body; // Ensure you're receiving the date from req.body
    console.log("Received date for slot update:", date);
    try {
        const result = await PickupSchedule.findOneAndUpdate(
            { date: new Date(date), slots: { $gt: 0 } },
            { $inc: { slots: -1 } },
            { new: true }
        );

        if (!result) {
            return res.status(400).json({ message: 'No available slots for this date' });
        }

        res.json({ message: 'Slot updated successfully', slotsRemaining: result.slots });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update slot availability', error });
    }
});

module.exports = router;
