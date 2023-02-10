import { notFoundError, forbidden } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import roomRepository from "@/repositories/room-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
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
  const booking = await bookingRepository.createBooking(userId, roomId);
  return { bookingId: booking.id }
};


const bookingService = {
  getBooking,
  postBookingRoomById,
};

export default bookingService;