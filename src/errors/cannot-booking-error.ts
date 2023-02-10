import { ApplicationError } from "@/protocols";

export function cannotListBooking(): ApplicationError {
  return {
    name: "CannotListBookingError",
    message: "Cannot list booking!",
  };
}
