import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import Navbar from "./Navbar";
import { useFetcher } from "@remix-run/react";
import { randomUUID } from "crypto";
import { db } from "~/db.server";
import { getDomainUrl } from "~/utils.server";
import { useClipboard } from "@mantine/hooks";
import { useRef, useState } from "react";
import Footer from "./Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "JSON Share" },
    {
      name: "description",
      content: "A simple web application for sharing JSON data",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:creator",
      content: "@NotRealAhmed",
    },
    {
      name: "twitter:title",
      content: "JSON Share",
    },
    {
      name: "twitter:description",
      content: "A simple web application for sharing JSON data",
    },
    {
      name: "twitter:image",
      content: "https://json-share.fly.dev/og-image.png",
    },
    {
      name: "twitter:url",
      content: "https://json-share.fly.dev/",
    },
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
  const [formatStatus, setFormatStatus] = useState<"valid" | "invalid" | null>(
    null
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitting = fetcher.state === "submitting";

  function handleJsonFormat(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!textAreaRef.current) return;
    const rawInput = e.target.value;
    if (rawInput.length === 0) return setFormatStatus(null);
    try {
      const parsedData = JSON.parse(rawInput);
      const formattedData = JSON.stringify(parsedData, null, 2);
      textAreaRef.current.value = formattedData;
      setFormatStatus("valid");
    } catch (error) {
      textAreaRef.current.value = rawInput;
      setFormatStatus("invalid");
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-base-200 py-12 min-h-[calc(100vh-64px-52px)] flex justify-center items-center">
        <section className="max-w-xl w-full space-y-8 px-4">
          <fetcher.Form method="post" className="flex flex-col gap-6">
            <div className="form-control">
              <label htmlFor="body" className="label">
                <span className="label-text">Paste JSON here</span>
                {formatStatus === "valid" ? (
                  <span className="label-text-alt text-success flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Valid JSON
                  </span>
                ) : formatStatus === "invalid" ? (
                  <span className="label-text-alt text-error flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    Invalid JSON
                  </span>
                ) : null}
              </label>
              <textarea
                name="body"
                id="body"
                className="textarea textarea-bordered h-96"
                ref={textAreaRef}
                onBlur={handleJsonFormat}
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <button
                className={`btn btn-info  ${isSubmitting && "btn-disabled"}`}
                tabIndex={isSubmitting ? -1 : undefined}
                aria-disabled={isSubmitting}
                type="submit"
              >
                Create Link
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
              </button>
              {fetcher.data?.link ? (
                <button
                  className="btn btn-success transition-all"
                  onClick={() => copy(fetcher.data?.link)}
                  type="button"
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
            </div>
          </fetcher.Form>
        </section>
      </main>
      <Footer />
    </>
  );
}
