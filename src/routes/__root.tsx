import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="nrc-theme">
      <div className="bg-background min-h-screen flex flex-col noise">
        <Outlet />

        <TanStackRouterDevtools />
      </div>
    </ThemeProvider>
  ),
});
