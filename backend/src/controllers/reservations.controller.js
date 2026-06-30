import * as ReservationService from '../services/reservations.service.js';

console.log('✅ Controlador de reservas cargado correctamente');

export const createReservation = async (req, res) => {
    try {
        const { items, ...reservationData } = req.body;
        // El service se encarga de la transacción y el stock
        const result = await ReservationService.createReservationService(reservationData, items);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllReservations = async (req, res) => {
    try {
        const { status } = req.query;
        const data = await ReservationService.findAllReservationsService(status);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await ReservationService.getReservationByIdService(id);
        res.json(data);
    } catch (error) {
        if (error.message === 'Reserva no encontrada') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const getReservationsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await ReservationService.findReservationsByUserService(userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, pickupDate, isEcoPackaging } = req.body;
        const result = await ReservationService.updateStatusService(id, { status, pickupDate, isEcoPackaging });

        res.json({ message: "Reserva actualizada con éxito", result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        await ReservationService.cancelReservationService(id);
        res.json({ message: "Reserva cancelada y stock reintegrado" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};