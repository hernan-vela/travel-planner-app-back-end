import { Router } from 'express' // Destructure Router from within the default export
import Trip from '../models/trip.js'
// import Expense from '../models/expense.js'
// import { auth, adminOnly } from '../auth.js'

const router = Router()


// Get all trips of the user
router.get('/trips', (req, res) => {
  res.send("TESTING");
})

// Get one trip
router.get('trips/:id', async (req, res) => {
  const tripId = req.params.id;

  const trip = await Trip.findOne({ _id: tripId }); // HERE THIS PART WAS COMPLEMENTED BY .populate('category') FOR THE nodeintro example.

  if (trip) {
    res.send(trip)
  } else {
    res.status(404).send({ error: `Trip with id ${tripId} not found`})
  }
})
// Create a new trip
// Update a trip
// Delete a trip

module.exports = { router }