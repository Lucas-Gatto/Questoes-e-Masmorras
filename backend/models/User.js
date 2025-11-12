const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: { 
        type: String, 
        default: '/avatars/Warrior.png' 
    },

    //Campos para recuperação de senha
    resetToken: String,
    resetTokenExpires: Date,

    // Flag: se já avaliou o site (para exibir avaliação apenas na primeira vez)
    hasSiteEvaluated: { type: Boolean, default: false },
});

//Criptografar senha antes de salvar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Método para comparar senha
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'Usuários');