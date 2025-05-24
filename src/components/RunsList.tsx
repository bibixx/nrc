import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import type { AudioGuidedRun } from "../data/runs.json.d";
import type { ChangeEvent } from "react";

interface RunsListProps {
  runs: Array<AudioGuidedRun>;
}

export function RunsList({ runs }: RunsListProps) {
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

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Nike Run Club Guided Runs</h1>
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search runs by name..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRuns.map((run) => (
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenInApp(run.id);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Open in App
                  </button>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
