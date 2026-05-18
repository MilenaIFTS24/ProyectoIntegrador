import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const ReservationItems = sequelize.define('ReservationItems', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reservationId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'reservation_items',
  timestamps: false
});

export default ReservationItems;