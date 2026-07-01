import sequelize from '../data/database.js';
import Users from './users.model.js';
import Products from './products.model.js';
import Reservations from './reservations.model.js';
import ReservationItems from './reservationItems.model.js';
import Events from './events.model.js';
import EventRegistrations from './eventRegistrations.model.js';
import Offers from './offers.model.js';
import ProductOffers from './productOffers.model.js';

// --- RELACIONES DE PRODUCTOS Y RESERVAS ---
// Un usuario puede realizar muchas reservas
Users.hasMany(Reservations, { foreignKey: 'userId', as: 'reservations' });

// Una reserva pertenece a un usuario
Reservations.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

// Una reserva se compone de varios items
Reservations.hasMany(ReservationItems, {
  foreignKey: 'reservationId',
  as: 'items',
  onDelete: 'CASCADE'
});

// Un item pertenece a una reserva
ReservationItems.belongsTo(Reservations, { foreignKey: 'reservationId' });

// Cada item de la reserva apunta a un producto específico
ReservationItems.belongsTo(Products, { foreignKey: 'productId', as: 'product' });

// Un producto puede estar en muchas reservas
Products.hasMany(ReservationItems, { foreignKey: 'productId' });


// --- RELACIONES DE EVENTOS Y USUARIOS ---
// Vincula Users y Events a través de EventRegistrations

// Un usuario se inscribe a muchos eventos
Users.belongsToMany(Events, {
  through: EventRegistrations,
  foreignKey: 'userId',
  as: 'registeredEvents'
});

// Un evento tiene muchos usuarios inscritos
Events.belongsToMany(Users, {
  through: EventRegistrations,
  foreignKey: 'eventId',
  as: 'attendees'
});

// Relación de EventRegistrations con Users y Events
EventRegistrations.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
EventRegistrations.belongsTo(Events, { foreignKey: 'eventId', as: 'event' });

// -- RELACIÓN DE PRODUCTOS Y OFERTAS --

// Vincula Products y Offers a través de ProductOffers
Offers.belongsToMany(Products, { through: ProductOffers, foreignKey: 'offerId', as: 'Products' });
Products.belongsToMany(Offers, { through: ProductOffers, foreignKey: 'productId', as: 'Offers' });

// Un producto puede pertenecer a muchos ProductOffers
Products.hasMany(ProductOffers, { foreignKey: 'productId' });

// Una oferta puede pertenecer a muchos ProductOffers
Offers.hasMany(ProductOffers, { foreignKey: 'offerId' });

// Un ProductOffers pertenece a una oferta
ProductOffers.belongsTo(Offers, { foreignKey: 'offerId' });
// Un ProductOffers puede pertenecer a un producto
ProductOffers.belongsTo(Products, { foreignKey: 'productId' });

export {
  sequelize,
  Users,
  Products,
  Reservations,
  ReservationItems,
  Events,
  EventRegistrations,
  Offers,
  ProductOffers
};