import { actionHeaders } from "@/lib/action-headers";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      rules: [
        {
          pathPattern: "/api/actions/**",
          apiPath: "/api/actions/**",
        },
        {
          pathPattern: "/tip",
          apiPath: "/api/actions/tip",
        },
      ],
    },
    { headers: actionHeaders },
  );
}

export async function OPTIONS() {
  return Response.json(null, { headers: actionHeaders });
}
