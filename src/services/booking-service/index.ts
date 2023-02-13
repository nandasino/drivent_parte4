import { notFoundError, forbidden } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
};

async function postBookingRoomById(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbidden();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbidden();
  }
  const room = await roomRepository.findRoomById(roomId);
  if (!room){
    throw notFoundError();
  }
  const bookings = await bookingRepository.findBookingByRoom(roomId);
  if (room.capacity <= bookings.length) {
    throw forbidden();
  }
  const bookingData = {
    userId,
    roomId
  };
  const booking = await bookingRepository.createBooking(bookingData);
  return { bookingId: booking.id }
};

async function updateBookingRoomById(userId: number, roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room){
    throw notFoundError();
  }
  const bookings = await bookingRepository.findBookingByRoom(roomId);
  if (room.capacity <= bookings.length) {
    throw forbidden();
  }
  const bookingExist = await bookingRepository.findBookingByUserId(userId);
  if(!bookingExist){
    throw forbidden();
  }
  const bookingData = {
    id: bookingExist.id,
    userId,
    roomId
  };
  const booking = await bookingRepository.upsertBooking(bookingData);
  return { bookingId: booking.id };
};

const bookingService = {
  getBooking,
  postBookingRoomById,
  updateBookingRoomById,
};

export default bookingService;