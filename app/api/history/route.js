// app/api/history/route.js
import connectDB from "@/lib/mongoose.js";
import History from "@/models/history.js";

export async function GET() {
  await connectDB();
  const history = await History.find();
  return Response.json(history);
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ message: "No data to save" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const saved = await History.insertMany(data);

    return new Response(JSON.stringify({ message: "Saved to history", data: saved }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Failed to save to history:", error);
    return new Response(
      JSON.stringify({ message: "Failed to save to history", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}