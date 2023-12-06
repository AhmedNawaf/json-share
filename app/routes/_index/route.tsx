import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import Navbar from "./Navbar";
import { randomUUID } from "crypto";
import { db } from "~/db.server";
import { getDomainUrl } from "~/utils.server";
import Footer from "./Footer";
import JsonTab from "./JsonTab";
import ParamsTab from "./ParamsTab";
import { useState } from "react";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 16 });

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
  const origin = getDomainUrl(request);
  if (body.length < 5)
    return json({ success: false, link: null } as const, { status: 400 });
  const newUUID = randomUUID();
  const fullURL = `https://jsonformatter.org/json-viewer/?url=${origin}/api/resource?uuid=${newUUID}`;
  const jsonBody = await db.jsonBody.create({
    data: {
      body,
      uuid: newUUID,
      link: fullURL,
      shortLink: uid.rnd(),
    },
  });

  return json({
    success: true,
    link: `${origin}/api/${jsonBody.shortLink}`,
  } as const);
};

export default function Index() {
  const [currentTab, setCurrentTab] = useState<"json" | "search-params" | null>(
    "json"
  );
  return (
    <>
      <Navbar />
      <main className="bg-base-100 py-12 min-h-[calc(100vh-64px-52px)] flex justify-center flex-col items-center">
        <div role="tablist" className="tabs tabs-boxed ">
          <button
            role="tab"
            className={`tab ${currentTab === "json" && "tab-active"}`}
            onClick={() => setCurrentTab("json")}
          >
            JSON
          </button>
          <button
            role="tab"
            className={`tab ${currentTab === "search-params" && "tab-active"}`}
            onClick={() => setCurrentTab("search-params")}
          >
            Search Params
          </button>
        </div>
        <section className="max-w-2xl w-full px-4">
          {currentTab === "search-params" ? <ParamsTab /> : <JsonTab />}
        </section>
      </main>
      <Footer />
    </>
  );
}
