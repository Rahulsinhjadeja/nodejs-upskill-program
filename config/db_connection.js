const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_CONN_URL, {
            // tlsAllowInvalidCertificates: true, // If connection successful but after sometime getting crash in mongoose due to certificate issue because of company vpn then use this to allow invalid/self-signed certs (Not safe but useful for testing purpose)
            // serverSelectionTimeoutMS: 10000
        });
        console.log('Database Connected Successfully ...!!');
    } catch (connErr) {
        console.error('Connection Error: ', connErr.message);
        process.exit(1);
    }
}

module.exports = connectDB