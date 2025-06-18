// app/api/bookings/route.js
import connectDB from "@/lib/mongoose.js";
import Booking from "@/models/booking.js";

export async function GET() {
  await connectDB();
  const bookings = await Booking.find();
  return Response.json(bookings);
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const booking = await Booking.create(body);
    return new Response(JSON.stringify(booking), { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error); // add this
    return new Response(JSON.stringify({ message: 'Error adding booking', error: error.message }), {
      status: 500,
    });
  }
}

