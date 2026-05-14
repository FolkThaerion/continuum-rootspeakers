export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/events`, {
    method: "POST",
  });

  const data = await response.json();

  return Response.json({
    success: true,
    message: "Scheduled Continuum event triggered.",
    eventResult: data,
  });
}
