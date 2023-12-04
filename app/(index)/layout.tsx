"use client";
import "../css/App.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="login-page">
          <span className="top-shape"></span>
          <span className="bottom-shape"></span>
          {children}
        </div>
      </body>
    </html>
  );
}
