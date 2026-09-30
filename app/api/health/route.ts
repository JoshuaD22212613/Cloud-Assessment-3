export async function GET() {
  return Response.json(
    {
      status: "ok",
      message: "Phoneme activity builder API is running",
    },
    { status: 200 }
  );
}