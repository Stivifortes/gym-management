const sequelize = require('../index');
const User = require('../../models/user');
const path = require('path');

async function addRoleToUsers() {
    try {
        // Primeiro, sincroniza o modelo para garantir que a tabela existe
        await User.sync();
        
        // Verifica se a coluna role já existe
        const tableInfo = await sequelize.queryInterface.describeTable('Users');
        if (!tableInfo.role) {
            await sequelize.query(`
                ALTER TABLE Users 
                ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT 'user'
            `);
            console.log('Role column added successfully');
        } else {
            console.log('Role column already exists');
        }
    } catch (error) {
        console.error('Error adding role column:', error);
        throw error;
    }
}

module.exports = addRoleToUsers; 