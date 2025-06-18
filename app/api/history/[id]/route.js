import connectDB from "@/lib/mongoose";
import History from "@/models/history";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await History.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated) return new Response("Not Found", { status: 404 });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Update failed", error }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deleted = await History.findByIdAndDelete(params.id);
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
