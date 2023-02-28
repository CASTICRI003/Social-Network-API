const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomUser, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected');

    await Thought.deleteMany({});

    await User.deleteMany({});

    const users = [];

    for (let i = 0; i < 20; i++) {
        const assignments = getRandomThoughts(20);

        const fullName = getRandomUser();
        const firstName = fullName.split(' ')[0];
        const lastName = fullName.split(' ')[1];
        const github = `${firstName}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

        users.push({
            firstName,
            lastName,
            github,
            assignments,
        });
    }

    await User.collection.insertMany(users);

    await Thought.collection.insertOne({
        thought: 'Oingo Boingo',
        inPerson: false,
        users: [...users],
    });

    console.table(users);
    console.info('Seeding complete!');
    process.exit(0);
});