// app/api/bookings/delete-bulk.js
import connectDB from "@/lib/mongoose";
import Booking from "@/models/booking.js";

export async function DELETE(req) {
  try {
    await connectDB();

    const payload = await req.json();
    console.log("🔹 delete-bulk payload:", payload);

    const { ids } = payload;
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ message: "No IDs provided" }), { status: 400 });
    }

    const result = await Booking.deleteMany({ _id: { $in: ids } });
    console.log("⬇️ delete-many result:", result);

    return new Response(JSON.stringify({ message: "Deleted", result }), { status: 200 });
  } catch (error) {
    console.error("❗ delete-bulk error:", error);
    return new Response(JSON.stringify({ message: "Bulk delete failed", error: error.message }), { status: 500 });
  }
}
