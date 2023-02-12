import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    }
  });
}
async function findBookingByRoom(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId }
  });
}

async function createBooking(booking: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      ...booking,
    }
  })
}

type CreateBookingParams = Omit <Booking, "id" | "createdAt" | "updatedAt">

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoom,
  createBooking,
};

export default bookingRepository;