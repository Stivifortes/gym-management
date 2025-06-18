const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, email, address, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
        username, 
        password: hashedPassword, 
        email, 
        address, 
        phone,
        role: role || 'user'
    });
    const userDTO = {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
    };
    res.status(201).json(userDTO);
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    const users = await User.findAll();
    const userDTO = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
    }));
    res.status(200).json(userDTO);
};  

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, email, address, phone, role } = req.body;
        
        // Se houver senha, criptografa
        let updateData = { username, email, address, phone, role };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Atualiza o usuário
        const [updated] = await User.update(updateData, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Busca o usuário atualizado
        const updatedUser = await User.findByPk(id);
        const userDTO = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            address: updatedUser.address,
            phone: updatedUser.phone,
            role: updatedUser.role
        };

        res.status(200).json(userDTO);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { username } = req.body;
    const user = await User.destroy({ where: { username } });
    const userDTO = {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
    };
    res.status(200).json(userDTO);
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    const userDTO = {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
    };
    res.status(200).json(userDTO);
};

exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    const userDTO = {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role
    };
    res.status(200).json(userDTO);
};







