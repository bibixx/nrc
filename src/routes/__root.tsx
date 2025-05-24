import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="nrc-theme">
      <div className="bg-background min-h-screen flex flex-col">
        <Header />

        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </ThemeProvider>
  ),
});
