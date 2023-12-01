import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import Navbar from "./Navbar";
import { useFetcher } from "@remix-run/react";
import { randomUUID } from "crypto";
import { db } from "~/db.server";
import { getDomainUrl } from "~/utils.server";
import { useClipboard } from "@mantine/hooks";

export const meta: MetaFunction = () => {
  return [
    { title: "Share JSON" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = formData.get("body") as string;
  if (body.length < 5) return json({ success: false, link: null } as const);
  const newUUID = randomUUID();
  const jsonBody = await db.jsonBody.create({
    data: {
      body,
      uuid: newUUID,
      link: `https://jsonformatter.org/json-viewer/?url=${getDomainUrl(
        request
      )}/api/resource?uuid=${newUUID}`,
    },
  });

  return json({
    success: true,
    link: jsonBody.link,
  } as const);
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const { copied, copy } = useClipboard();

  const isSubmitting = fetcher.state === "submitting";
  return (
    <>
      <Navbar />
      <main className="bg-base-200 py-12 min-h-[calc(100vh-64px)] flex justify-center items-center">
        <section className="max-w-xl w-full space-y-8">
          <fetcher.Form method="post" className="flex flex-col gap-6">
            <div className="form-control">
              <label htmlFor="body" className="label">
                <span className="label-text">Paste JSON here</span>
              </label>
              <textarea
                name="body"
                id="body"
                className="textarea textarea-bordered h-96"
              ></textarea>
            </div>
            <button
              className={`btn btn-info self-start ${
                isSubmitting && "btn-disabled"
              }`}
              tabIndex={isSubmitting ? -1 : undefined}
              aria-disabled={isSubmitting}
            >
              Create Link
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
            </button>
          </fetcher.Form>
          {fetcher.data?.link ? (
            <button
              className="btn btn-success transition-all"
              onClick={() => copy(fetcher.data?.link)}
            >
              {copied ? (
                <span>
                  Copied!
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline ms-4"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </span>
              ) : (
                <span>
                  Copy to clipboard
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline ms-4"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </svg>
                </span>
              )}
            </button>
          ) : (
            <>&nbsp;</>
          )}
        </section>
      </main>
    </>
  );
}
