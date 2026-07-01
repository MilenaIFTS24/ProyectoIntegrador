import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

// Modelo para la tabla "events" usando Sequelize
const Events = sequelize.define('Events', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  type: {
    type: DataTypes.ENUM('taller', 'feria', 'presentacion', 'degustacion', 'actividad'),
    allowNull: false
  },
  location: { type: DataTypes.STRING, allowNull: false },
  isVirtual: { type: DataTypes.BOOLEAN, defaultValue: false },
  isFree: { type: DataTypes.BOOLEAN, defaultValue: true },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  requiresRegistration: { type: DataTypes.BOOLEAN, defaultValue: false },
  maxCapacity: { type: DataTypes.INTEGER, allowNull: true },
  organizerContact: { type: DataTypes.STRING, allowNull: true },
  promoImage: { type: DataTypes.STRING, allowNull: true },
  ecoFocus: { type: DataTypes.STRING, allowNull: true },
  materials: { type: DataTypes.TEXT, allowNull: true },
  isCancelledByRain: { type: DataTypes.BOOLEAN, defaultValue: false },
  currentRegistrations: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('currentRegistrations');
    }
  }
}, {
  tableName: 'events',
  timestamps: true
});

export default Events;