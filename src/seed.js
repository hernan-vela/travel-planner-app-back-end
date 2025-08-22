const bcrypt = require('bcrypt');
const { connect, close } = require('./db');
const User = require('./models/user');
const Trip = require('./models/trip');
const Category = require('./models/category');
const Expense = require('./models/expense');

const trips = [
  { location: 'New Caledonia', arrivalDate: '2025-04-01', departureDate: '2025-04-07' },
  { location: 'Fiji',          arrivalDate: '2025-04-08', departureDate: '2025-04-15' },
  { location: 'Bali, Indonesia', arrivalDate: '2025-06-16', departureDate: '2025-06-20' }
];

const categories = [
  { name: 'Food' },
  { name: 'Transport' },
  { name: 'Accommodation' }
];

const expenses = [
  { amount: 100, description: 'Dinner' },
  { amount: 50,  description: 'Taxi' }
];

// The caller (a script or tests) decides when to connect/close.
async function seed() {
  // clear
  await Promise.all([
    User.deleteMany(),
    Trip.deleteMany(),
    Category.deleteMany(),
    Expense.deleteMany()
  ]);

  // users
  const users = [
    { email: 'jesso@jesso.me',   password: await bcrypt.hash('password', 10), accountType: 'admin' },
    { email: 'felicis@jesso.me', password: await bcrypt.hash('felicis', 10),  accountType: 'user'  }
  ];
  const createdUsers = await User.create(users);

  // trips (assign to first user)
  const userId = createdUsers[0]._id;
  const tripsWithUser = trips.map(t => ({ ...t, userId, totalExpense: 0 }));
  const createdTrips = await Trip.create(tripsWithUser);

  // categories (assign to first user)
  const catsWithUser = categories.map(c => ({ ...c, user: userId }));
  const createdCategories = await Category.create(catsWithUser);

  // expenses (assign to first trip + categories)
  const exps = [
    { ...expenses[0], trip: createdTrips[0]._id, category: createdCategories[0]._id },
    { ...expenses[1], trip: createdTrips[0]._id, category: createdCategories[1]._id }
  ];
  await Expense.create(exps);

  // recompute totalExpense per trip
  for (const trip of createdTrips) {
    const total = await Expense.aggregate([
      { $match: { trip: trip._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    trip.totalExpense = total[0]?.total ?? 0;
    await trip.save();
  }

  console.log('Database seeded successfully');
}

// When run directly: connect → seed → close
if (require.main === module) {
  (async () => {
    try {
      await connect();
      await seed();
    } catch (err) {
      console.error('Seeding error:', err);
      process.exitCode = 1;
    } finally {
      await close();
    }
  })();
}

module.exports = { seed };
