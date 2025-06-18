const addRoleToUsers = require('./addRoleToUsers');

async function runMigrations() {
    try {
        await addRoleToUsers();
        console.log('All migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}

runMigrations(); 