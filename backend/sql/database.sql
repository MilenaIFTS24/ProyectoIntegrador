-- Código SQL para construir y replicar la base de datos en
-- PostgreSQL / Supabase

-- Habilitar extensión para generación de UUID (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tipos ENUM
CREATE TYPE "enum_products_productType" AS ENUM ('tea', 'craft');
CREATE TYPE "enum_reservations_paymentMethod" AS ENUM ('debito', 'credito', 'contado', 'billetera_virtual');
CREATE TYPE "enum_reservations_status" AS ENUM ('pendiente', 'listo', 'entregada', 'cancelada');
CREATE TYPE "enum_event_registrations_status" AS ENUM ('confirmada', 'cancelada', 'lista_espera');
CREATE TYPE "enum_events_type" AS ENUM ('taller', 'feria', 'presentacion', 'degustacion', 'actividad');
CREATE TYPE "enum_offers_type" AS ENUM ('fixed', 'percentage', 'quantity');
CREATE TYPE "enum_users_role" AS ENUM ('user', 'admin');

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullName VARCHAR(255) NOT NULL,                             -- Nombre completo
    birthDate DATE NOT NULL,                                    -- Fecha de nacimiento
    email VARCHAR(255) NOT NULL UNIQUE,                         -- Correo electrónico (único)
    password VARCHAR(255) NOT NULL,                             -- Contraseña
    isEmailVerified BOOLEAN DEFAULT FALSE,                      -- ¿Correo verificado?
    isEnabled BOOLEAN DEFAULT TRUE,                             -- ¿Usuario habilitado?
    phone VARCHAR(255),                                         -- Teléfono
    address TEXT,                                               -- Dirección
    lastLogin TIMESTAMP,                                        -- Último inicio de sesión
    passwordRecoveryToken VARCHAR(255),                         -- Token para recuperación de contraseña
    role "enum_users_role" DEFAULT 'user',                      -- Rol del usuario
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,                                 -- Nombre del producto
    description TEXT,                                           -- Descripción
    price REAL NOT NULL,                                        -- Precio
    stock INTEGER DEFAULT 0,                                    -- Stock disponible
    image VARCHAR(255),                                         -- URL de la imagen
    productType "enum_products_productType" NOT NULL,           -- Tipo: té o artesanía
    -- Atributos específicos de tés
    brand VARCHAR(255),                                         -- Marca
    origin VARCHAR(255),                                        -- Origen
    hasCaffeine BOOLEAN DEFAULT FALSE,                          -- ¿Contiene cafeína?
    isOrganic BOOLEAN DEFAULT FALSE,                            -- ¿Es orgánico?
    isFairTrade BOOLEAN DEFAULT FALSE,                          -- ¿Comercio justo?
    format VARCHAR(255),                                        -- Formato de presentación
    weightPerUnit REAL,                                         -- Peso por unidad
    -- Atributos específicos de artesanías
    brandArtist VARCHAR(255),                                   -- Marca del artista
    category VARCHAR(255),                                      -- Categoría
    creationDate VARCHAR(255),                                  -- Fecha de creación
    weight REAL,                                                -- Peso
    isUnique BOOLEAN DEFAULT FALSE,                             -- ¿Es pieza única?
    materials TEXT[] DEFAULT '{}',                              -- Materiales (array)
    ecoFriendly BOOLEAN DEFAULT TRUE,                           -- ¿Eco-amigable?
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ofertas
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,                                -- Título de la oferta
    type "enum_offers_type" NOT NULL,                           -- Tipo: fijo, porcentaje, cantidad
    value REAL NOT NULL,                                        -- Valor de la oferta
    active BOOLEAN DEFAULT TRUE,                                -- ¿Oferta activa?
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,  -- Usuario que realiza la reserva
    contactEmail VARCHAR(255) NOT NULL,                             -- Email de contacto
    subtotal NUMERIC(10,2) NOT NULL,                                -- Subtotal
    discount NUMERIC(10,2) DEFAULT 0,                               -- Descuento aplicado
    totalAmount NUMERIC(10,2) NOT NULL,                             -- Monto total
    paymentMethod "enum_reservations_paymentMethod" NOT NULL,      -- Método de pago
    paymentId VARCHAR(255),                                         -- ID de pago (externo)
    pickupDate DATE,                                                -- Fecha de retiro
    pickupTimeSlot VARCHAR(255) NOT NULL,                           -- Horario de retiro
    isEcoPackaging BOOLEAN DEFAULT FALSE,                           -- ¿Empaque ecológico?
    clientNotes TEXT,                                               -- Notas del cliente
    status "enum_reservations_status" DEFAULT 'pendiente',          -- Estado de la reserva
    cancelledAt TIMESTAMP,                                          -- Fecha de cancelación
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de eventos
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,                                -- Título del evento
    date DATE NOT NULL,                                         -- Fecha
    startTime TIME NOT NULL,                                    -- Hora de inicio
    endTime TIME,                                               -- Hora de fin
    description TEXT NOT NULL,                                  -- Descripción
    type "enum_events_type" NOT NULL,                           -- Tipo de evento
    location VARCHAR(255) NOT NULL,                             -- Ubicación
    isVirtual BOOLEAN DEFAULT FALSE,                            -- ¿Virtual?
    isFree BOOLEAN DEFAULT TRUE,                                -- ¿Gratuito?
    price NUMERIC(10,2) DEFAULT 0,                              -- Precio (si no es gratuito)
    requiresRegistration BOOLEAN DEFAULT FALSE,                 -- ¿Requiere inscripción?
    maxCapacity INTEGER,                                        -- Capacidad máxima
    organizerContact VARCHAR(255),                              -- Contacto del organizador
    promoImage VARCHAR(255),                                    -- Imagen promocional
    ecoFocus VARCHAR(255),                                      -- Enfoque ecológico
    materials TEXT,                                             -- Materiales necesarios
    isCancelledByRain BOOLEAN DEFAULT FALSE,                    -- ¿Cancelado por lluvia?
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ítems de reserva
CREATE TABLE reservation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservationId UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,  -- Reserva asociada
    productId UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,         -- Producto
    quantity INTEGER NOT NULL,                                                   -- Cantidad
    unitPrice NUMERIC(10,2) NOT NULL                                             -- Precio unitario en el momento de la reserva
);

-- Tabla de inscripciones a eventos (tabla puente)
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,  -- Usuario inscrito
    eventId UUID NOT NULL REFERENCES events(id) ON DELETE RESTRICT,-- Evento al que se inscribe
    registrationDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha de inscripción
    status "enum_event_registrations_status" DEFAULT 'confirmada', -- Estado de la inscripción
    attended BOOLEAN DEFAULT FALSE,                                 -- ¿Asistió?
    notes TEXT,                                                     -- Notas adicionales
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla puente entre productos y ofertas
CREATE TABLE product_offers (
    id SERIAL PRIMARY KEY,
    productId UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- Producto
    offerId UUID NOT NULL REFERENCES offers(id) ON DELETE RESTRICT,     -- Oferta
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices opcionales para mejorar el rendimiento en claves foráneas
CREATE INDEX idx_reservations_userId ON reservations(userId);
CREATE INDEX idx_reservation_items_reservationId ON reservation_items(reservationId);
CREATE INDEX idx_reservation_items_productId ON reservation_items(productId);
CREATE INDEX idx_event_registrations_userId ON event_registrations(userId);
CREATE INDEX idx_event_registrations_eventId ON event_registrations(eventId);
CREATE INDEX idx_product_offers_productId ON product_offers(productId);
CREATE INDEX idx_product_offers_offerId ON product_offers(offerId);