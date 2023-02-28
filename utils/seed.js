const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomUser, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Connected');

    await Course.deleteMany({});

    await Student.deleteMany({});

    const students = [];

    for (let i = 0; i < 20; i++) {
        const assignments = getRandomThoughts(20);

        const fullName = getRandomUser();
        const firstName = fullName.split(' ')[0];
        const lastName = fullName.split(' ')[1];
        const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

        students.push({
            firstName,
            lastName,
            github,
            assignments,
        });
    }

    await Student.collection.insertMany(students);

    await Course.collection.insertOne({
        courseName: 'Oingo Boingo',
        inPerson: false,
        students: [...students],
    });

    console.table(students);
    console.info('Seeding complete!');
    process.exit(0);
});