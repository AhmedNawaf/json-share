import { useClipboard } from "@mantine/hooks";
import { useRef, useState } from "react";
import { useFetcher } from "react-router-dom";

export default function ParamsTab() {
  const fetcher = useFetcher();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = fetcher.state === "submitting";
  const { copied, copy } = useClipboard();
  const [formatStatus, setFormatStatus] = useState<"valid" | "invalid" | null>(
    null
  );
  function handleConversion(e: React.ChangeEvent<HTMLInputElement>) {
    if (!inputRef.current) return;
    if (!textAreaRef.current) return;

    const rawInput = e.target.value;
    if (rawInput.length === 0) return setFormatStatus(null);
    if (!rawInput.includes("?")) return setFormatStatus("invalid");
    const searchQuery = rawInput.slice(rawInput.indexOf("?") + 1);
    const searchParams = searchQuery.split("&");
    const objectOfParams: Record<string, unknown> = {};
    searchParams.forEach((param) => {
      const [key, value] = param.split("=");
      objectOfParams[key] = Number(value) ? Number(value) : value;
    });
    textAreaRef.current.value = JSON.stringify(objectOfParams, null, 2);
    setFormatStatus("valid");
  }
  return (
    <fetcher.Form
      method="post"
      className="flex flex-col gap-6"
      action="/?index"
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">Paste URL here</span>
        </label>

        <input
          type="text"
          ref={inputRef}
          placeholder="some-url?key1=value1&key2=value2...."
          className="input input-bordered"
          onBlur={handleConversion}
        />
      </div>
      <div className="form-control">
        <label htmlFor="body" className="label">
          <span className="label-text">JSON Output</span>
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
          readOnly
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
          {isSubmitting && <span className="loading loading-spinner"></span>}
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
  );
}
