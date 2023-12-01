import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const uuid = searchParams.get("uuid");
  if (!uuid) return json({ success: false, message: "uuid is required" });

  const jsonBody = await db.jsonBody.findFirst({
    where: {
      uuid,
    },
  });
  if (!jsonBody) {
    return json({
      success: false,
      message: "No Record was found",
    });
  }
  return json(JSON.parse(jsonBody.body));
};
