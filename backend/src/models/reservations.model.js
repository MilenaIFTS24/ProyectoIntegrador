import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const Reservations = sequelize.define('Reservations', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  contactEmail: { type: DataTypes.STRING, allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMethod: {
    type: DataTypes.ENUM('debito', 'credito', 'contado', 'billetera_virtual'),
    allowNull: false
  },
  paymentId: { type: DataTypes.STRING, allowNull: true },
  pickupDate: { type: DataTypes.DATE, allowNull: true },
  pickupTimeSlot: { type: DataTypes.STRING, allowNull: false },
  isEcoPackaging: { type: DataTypes.BOOLEAN, defaultValue: false },
  clientNotes: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('pendiente', 'listo', 'entregada', 'cancelada'),
    defaultValue: 'pendiente'
  },
  cancelledAt: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'reservations',
  timestamps: true
});

export default Reservations;