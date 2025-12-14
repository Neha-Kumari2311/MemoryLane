import "./globals.css";

export const metadata = {
  title: "MemoryLane - Login",
  description: "Create and share time capsules with your memories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display bg-background-light dark:bg-background-dark text-charcoal dark:text-stone-200 antialiased selection:bg-accent selection:text-charcoal">
        {children}
      </body>
    </html>
  );
}