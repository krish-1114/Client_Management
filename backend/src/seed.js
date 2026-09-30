// Seed sample data:  npm run seed
// Wipes clients + activities, then inserts 25 sample clients (enough to test pagination).
require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('./models/Client');
const Activity = require('./models/Activity');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/spreadme_clients';

const rows = [
  ['Shunya Labs', 'Krish Suthar', 'Himmatnagar'],
  ['Tata Motors Dealership', 'Rakesh Patel', 'Himmatnagar'],
  ['Gujarati Samaj Trust', 'Hitesh Shah', 'Ahmedabad'],
  ['Arvind Textiles', 'Meera Joshi', 'Ahmedabad'],
  ['Navrang Sweets', 'Jignesh Mehta', 'Surat'],
  ['BlueLeaf Pharma', 'Dr. Anita Desai', 'Vadodara'],
  ['Kesar Foods', 'Nirav Trivedi', 'Rajkot'],
  ['Sabarmati Infra', 'Paresh Modi', 'Gandhinagar'],
  ['Om Logistics', 'Vishal Rana', 'Mehsana'],
  ['Rudra Engineering', 'Kalpesh Bhatt', 'Kalol'],
  ['Pinnacle Realty', 'Sneha Kapadia', 'Ahmedabad'],
  ['GreenField Agro', 'Bharat Chaudhary', 'Palanpur'],
  ['Zenith Software', 'Riya Nair', 'Bengaluru'],
  ['Maple Learning Academy', 'Sunita Verma', 'Pune'],
  ['Coastal Exports', 'Imran Qureshi', 'Mumbai'],
  ['Bright Dental Care', 'Dr. Karan Malhotra', 'Delhi'],
  ['Urban Threads', 'Pooja Iyer', 'Chennai'],
  ['Vertex Auto Parts', 'Sanjay Gupta', 'Jaipur'],
  ['Lotus Hospitality', 'Deepa Menon', 'Kochi'],
  ['Skyline Solar', 'Amit Sharma', 'Indore'],
  ['Orchid Salon', 'Neha Kulkarni', 'Nashik'],
  ['Falcon Security', 'Rajesh Singh', 'Lucknow'],
  ['Harmony Music School', 'Tanvi Rao', 'Hyderabad'],
  ['Nimbus Cloud Services', 'Aditya Kumar', 'Noida'],
  ['Ashoka Printing Press', 'Mohan Das', 'Kolkata'],
];
const notes = [
  'Prefers communication over email.',
  'Long-term client since last year. Renewal due soon.',
  'Interested in the premium plan.',
  '',
  'Requested a callback next week.',
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

async function run() {
  await mongoose.connect(MONGO_URI);
  await Client.deleteMany({});
  await Activity.deleteMany({});

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const docs = rows.map(([name, contactPerson, city], i) => {
    const createdAt = new Date(now - (rows.length - i) * day * 2);
    return {
      name,
      contactPerson,
      email: 'contact@' + slug(name) + '.com',
      phone: '+91 9' + String(800000000 + i * 1234567).slice(0, 9),
      address: city + ', India',
      status: i % 4 === 3 ? 'Inactive' : 'Active',
      notes: notes[i % notes.length],
      createdAt,
      updatedAt: createdAt,
    };
  });

  const clients = await Client.insertMany(docs, { timestamps: false });

  const activities = [];
  clients.forEach((c, i) => {
    activities.push({ client: c._id, type: 'created', message: 'Client created', createdAt: c.createdAt });
    if (i % 3 === 0) {
      activities.push({
        client: c._id,
        type: 'note_added',
        message: 'Initial call completed. Sent the proposal.',
        createdAt: new Date(c.createdAt.getTime() + 3600 * 1000),
      });
    }
    if (i % 5 === 0) {
      activities.push({
        client: c._id,
        type: 'updated',
        message: 'Information updated: phone, address',
        createdAt: new Date(c.createdAt.getTime() + 2 * 3600 * 1000),
      });
    }
  });
  await Activity.insertMany(activities);

  console.log('Seeded ' + clients.length + ' clients and ' + activities.length + ' activities');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect();
  process.exit(1);
});
