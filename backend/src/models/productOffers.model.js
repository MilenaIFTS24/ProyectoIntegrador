import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const ProductOffers = sequelize.define('ProductOffers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  offerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'offers',
      key: 'id'
    }
  }
}, {
  tableName: 'product_offers',
  timestamps: true
});

export default ProductOffers;