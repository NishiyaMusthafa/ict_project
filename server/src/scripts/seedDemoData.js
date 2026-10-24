import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedDemoData = async () => {
  try {
    console.log('🌱 Connecting to MongoDB to seed rich campus demo data...');
    const connected = await connectDB();
    if (!connected) {
      console.error('❌ Failed to connect to MongoDB. Check MONGODB_URI in server/.env');
      process.exit(1);
    }

    // 1. Create or retrieve Users
    console.log('👤 Setting up demo users...');

    let admin = await User.findOne({ email: 'admin@campus.edu' });
    if (!admin) {
      admin = await User.create({
        name: 'Chief Admin (Campus Safety)',
        email: 'admin@campus.edu',
        password: 'Admin@LostLoop123',
        role: 'admin',
        department: 'Campus Security Office',
        phone: '+1 (555) 012-3456'
      });
    }

    let studentAlex = await User.findOne({ email: 'alex@campus.edu' });
    if (!studentAlex) {
      studentAlex = await User.create({
        name: 'Alex Rivera',
        email: 'alex@campus.edu',
        password: 'StudentPass123!',
        role: 'student',
        department: 'Computer Science & Engineering',
        phone: '+1 (555) 987-6543'
      });
    }

    let studentPriya = await User.findOne({ email: 'priya@campus.edu' });
    if (!studentPriya) {
      studentPriya = await User.create({
        name: 'Priya Sharma',
        email: 'priya@campus.edu',
        password: 'StudentPass123!',
        role: 'student',
        department: 'Biotechnology & Life Sciences',
        phone: '+1 (555) 456-7890'
      });
    }

    // 2. Clear old items and claims for clean evaluation
    console.log('🧹 Refreshing demo items and claims...');
    await Claim.deleteMany({});
    await Item.deleteMany({});

    // 3. Create items
    const itemsData = [
      {
        title: 'Apple AirPods Pro (2nd Gen) in White MagSafe Case',
        description: 'Lost my AirPods Pro on the 2nd floor silent reading zone of the Main Library. The case has a slight scratch near the charging port and has an anime sticker on the back.',
        category: 'Electronics & Gadgets',
        campusLocation: 'Main Library',
        dateReported: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        type: 'lost',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
        contactInfo: 'alex.rivera@campus.edu or reach out in CS Lab 4',
        postedBy: studentAlex._id
      },
      {
        title: 'Dark Blue Hydro Flask 32oz with Campus Stickers',
        description: 'Found a cobalt blue Hydro Flask wide-mouth water bottle left behind on a wooden bench near the Student Activity Center coffee stand. Has a national parks sticker.',
        category: 'Bottles & Tumblers',
        campusLocation: 'Student Activity Center (SAC)',
        dateReported: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        type: 'found',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
        contactInfo: 'Turned into SAC front desk or message me here.',
        postedBy: studentPriya._id
      },
      {
        title: 'Campus Student ID Card & Metro Pass',
        description: 'Found an official student identity card belonging to an Engineering sophomore along with an orange transit card, dropped near the bus bay.',
        category: 'ID Cards & Wallets',
        campusLocation: 'Bus Bay & Parking Lot',
        dateReported: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        type: 'found',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        contactInfo: 'Available at Campus Security Main Booth',
        postedBy: admin._id
      },
      {
        title: 'Black North Face Surge Backpack with Engineering Notes',
        description: 'Left my black backpack under desk 14 in Science Block B after the Organic Chemistry exam. Contains a Spiral notebook with handwritten organic chemistry mechanisms.',
        category: 'Bags & Backpacks',
        campusLocation: 'Science Complex Block B',
        dateReported: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        type: 'lost',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        contactInfo: 'Text me or email urgently please!',
        postedBy: studentAlex._id
      },
      {
        title: 'Casio fx-991EX Scientific Calculator',
        description: 'Found a white & carbon-fiber Casio scientific calculator sitting on the front podium in Lecture Hall 3 right after the 11 AM physics lecture.',
        category: 'Electronics & Gadgets',
        campusLocation: 'Engineering Block A',
        dateReported: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        type: 'found',
        status: 'resolved', // Successfully reunited!
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
        contactInfo: 'Reunited with Alex in Block A lobby.',
        postedBy: studentPriya._id
      },
      {
        title: 'Car Key Fob with Red Leather Strap & Batman Keychain',
        description: 'Found a Honda car key fob with a worn leather loop and a black metal Batman miniature attached. Found on the synthetic grass at the Football field spectator bleachers.',
        category: 'Keys & Locks',
        campusLocation: 'Football Field & Track',
        dateReported: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        type: 'found',
        status: 'open',
        imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
        contactInfo: 'Currently kept in Athletics Office desk.',
        postedBy: studentPriya._id
      }
    ];

    const createdItems = await Item.insertMany(itemsData);
    console.log(`✅ Seeded ${createdItems.length} demo campus items.`);

    // 4. Create sample resolved claim for the calculator
    const calculatorItem = createdItems.find(i => i.title.includes('Casio'));
    if (calculatorItem) {
      const claim = await Claim.create({
        item: calculatorItem._id,
        claimedBy: studentAlex._id,
        message: 'This is my calculator! My initials "AR" are scratched on the battery cover latch on the back, and the solar panel has a blue mark.',
        proofDetails: 'Initials AR engraved on back battery cover',
        status: 'approved',
        responseNote: 'Verified initials AR on back plate. Returned to student successfully!',
        reviewedAt: new Date()
      });

      calculatorItem.resolvedClaim = claim._id;
      await calculatorItem.save();
      console.log('✅ Created sample approved claim demonstrating full Claim & Reunite cycle.');
    }

    // 5. Create a pending claim on the Blue Hydro Flask
    const flaskItem = createdItems.find(i => i.title.includes('Hydro Flask'));
    if (flaskItem) {
      await Claim.create({
        item: flaskItem._id,
        claimedBy: studentAlex._id,
        message: 'I forgot my bottle there! It has a Yosemite National Park sticker and a small dent on the bottom rim from dropping it on concrete.',
        proofDetails: 'Yosemite sticker and dent on bottom rim',
        status: 'pending'
      });
      console.log('✅ Created sample pending claim for testing student dashboard incoming claims.');
    }

    console.log('\n=============================================');
    console.log('✨ CAMPUS DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Students:');
    console.log('  1. alex@campus.edu  / StudentPass123!');
    console.log('  2. priya@campus.edu / StudentPass123!');
    console.log('Admin:');
    console.log('  3. admin@campus.edu / Admin@LostLoop123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error.message);
    process.exit(1);
  }
};

seedDemoData();
