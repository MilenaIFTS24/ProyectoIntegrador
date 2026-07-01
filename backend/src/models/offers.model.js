import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

// Modelo para la tabla "offers" usando Sequelize
const Offers = sequelize.define('Offers', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.ENUM('fixed', 'percentage', 'quantity'), 
    allowNull: false 
  },
  value: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'offers',
  timestamps: true
});

export default Offers;