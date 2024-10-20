const bcrypt = require('bcrypt');

const passwords = [
    { username: 'aliceadmin', password: 'adminpassword' },
    { username: 'johndoe', password: 'password123' }
];

const hashPasswords = async () => {
    for (const user of passwords) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log(`Username: ${user.username}, Hashed Password: ${hashedPassword}`);
    }
};

hashPasswords().catch(console.error);
