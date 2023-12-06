import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { link } = params;
  if (!link)
    return json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  const jsonBody = await db.jsonBody.findFirst({
    where: {
      shortLink: link,
    },
  });
  if (!jsonBody)
    return json(
      { success: false, message: "Record not found" },
      { status: 404 }
    );
  return redirect(jsonBody.link);
};
