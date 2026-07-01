import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

// Modelo para la tabla "event_registrations" usando Sequelize
const EventRegistrations = sequelize.define('EventRegistrations', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('confirmada', 'cancelada', 'lista_espera'),
    defaultValue: 'confirmada'
  },
  attended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'event_registrations',
  timestamps: true
});

export default EventRegistrations;