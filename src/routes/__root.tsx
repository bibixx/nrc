import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="bg-background min-h-screen flex flex-col">
      <Outlet />

      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
