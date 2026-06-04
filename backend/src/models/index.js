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
Reservations.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

// Una reserva se compone de varios items
Reservations.hasMany(ReservationItems, { 
  foreignKey: 'reservationId', 
  as: 'items', 
  onDelete: 'CASCADE' 
});
ReservationItems.belongsTo(Reservations, { foreignKey: 'reservationId' });

// Cada item de la reserva apunta a un producto específico
ReservationItems.belongsTo(Products, { foreignKey: 'productId', as: 'product' });
Products.hasMany(ReservationItems, { foreignKey: 'productId' });


// --- RELACIONES DE EVENTOS (Muchos a Muchos) ---
// vinculamos Users y Events a través de EventRegistrations

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

EventRegistrations.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
EventRegistrations.belongsTo(Events, { foreignKey: 'eventId', as: 'event' });

// -- RELACIÓN DE PRODUCTOS Y OFERTAS --

Products.hasMany(ProductOffers, { foreignKey: 'productId' });
ProductOffers.belongsTo(Products, { foreignKey: 'productId' });

Offers.hasMany(ProductOffers, { foreignKey: 'offerId' });
ProductOffers.belongsTo(Offers, { foreignKey: 'offerId' });


export {
  Users,
  Products,
  Reservations,
  ReservationItems,
  Events,
  EventRegistrations,
  Offers,
  ProductOffers
};