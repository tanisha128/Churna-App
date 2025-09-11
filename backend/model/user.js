const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
{

email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
},
{ timestamps: true }
);


const User = mongoose.model('User', userSchema);
module.exports = User;