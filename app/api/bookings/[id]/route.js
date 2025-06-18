// app/api/bookings/route.js
import connectDB from "@/lib/mongoose.js";
import Booking from "@/models/booking.js";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();
    const updatedBooking = await Booking.findByIdAndUpdate(params.id, data, {
      new: true,
    });
    return new Response(JSON.stringify(updatedBooking), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Update failed', error }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deleted = await Booking.findByIdAndDelete(params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "Booking not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Booking deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Delete failed", error }), {
      status: 500,
    });
  }
}