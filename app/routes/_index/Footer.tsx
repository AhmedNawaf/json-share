import { Link } from "@remix-run/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <aside>
        <p>
          Copyright © {currentYear} - All right reserved by{" "}
          <Link
            target="_blank"
            referrerPolicy="no-referrer"
            to={"https://github.com/AhmedNawaf"}
            className="link"
          >
            Ahmed
          </Link>
        </p>
      </aside>
    </footer>
  );
}
