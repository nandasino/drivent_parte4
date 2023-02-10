import { prisma } from "@/config";

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

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    }
  })
}

const bookingRepository = {
  findBookingByUserId,
  findBookingByRoom,
  createBooking,
};

export default bookingRepository;