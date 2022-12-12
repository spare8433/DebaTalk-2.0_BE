import { Sequelize } from 'sequelize';
const env = process.env.NODE_ENV as ('development' | 'test' | 'production') || 'development'
const config = require('../config/config')[env]

console.log(env, config);

export const sequelize = new Sequelize(config.database, config.username, config.password!, config)
export default sequelize