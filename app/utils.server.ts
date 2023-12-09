import crypto from "crypto";

export function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export function generateRandomId() {
  const length = 16;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomBytes = crypto.randomBytes(length);

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % characters.length;
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function generateUUID() {
  return crypto.randomUUID();
}
