import { Providers } from "./providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "Hypehouse - Event Management Platform",
  description: "Create, discover, and join amazing events. Connect with people and make memories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              classNames: {
                toast: "backdrop-blur-xl bg-card/90 border-border/50",
                title: "text-foreground",
                description: "text-muted-foreground",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
