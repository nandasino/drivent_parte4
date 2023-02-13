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

async function upsertBooking(booking: UpdateBookingParams) {
  return prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      roomId: booking.roomId,
    }
  })
}

type CreateBookingParams = Omit <Booking, "id" | "createdAt" | "updatedAt">;
type UpdateBookingParams = Omit <Booking, "createdAt" | "updatedAt">;

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoom,
  createBooking,
  upsertBooking,
};

export default bookingRepository;