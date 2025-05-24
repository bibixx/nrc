import { Link, createFileRoute } from "@tanstack/react-router";
import { forwardRef, useCallback, useMemo, useState } from "react";
import runsData from "../data/runs.json";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Virtuoso, VirtuosoGrid, type GridComponents } from "react-virtuoso";
import { Input } from "../components/ui/input";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const runs = runsData.data.audioGuidedRuns;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRuns = runs.filter((run) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      run.landing.title.toLowerCase().includes(searchLower) || run.landing.subtitle.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenInApp = (id: string) => {
    const url = `https://nikerunclub.sng.link/A6sko/96h7?_dl=x-callback-url/audioguidedrun/details?id%3D${id}`;
    window.open(url, "_blank");
  };

  const components = useMemo(
    (): GridComponents => ({
      Header: () => (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">NRC Guided Runs</h1>
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search runs by name..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      ),
      List: forwardRef((props, ref) => {
        return (
          <div
            {...props}
            className={cn(
              "container mx-auto mb-4 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
              props.className,
            )}
            ref={ref}
          />
        );
      }),
    }),
    [searchQuery],
  );

  return (
    <VirtuosoGrid
      style={{ height: "100%" }}
      data={filteredRuns}
      className="min-h-screen w-full"
      components={components}
      itemContent={(_, run) => (
        <Card key={run.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link to="/run/$runId" params={{ runId: run.id }} className="block">
            <CardHeader>
              <CardTitle>{run.landing.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{run.landing.subtitle}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  Goal: {run.properties.goal} {run.properties.activityType}
                </span>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenInApp(run.id);
                  }}
                >
                  Open in App
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>
      )}
    />
  );
}
