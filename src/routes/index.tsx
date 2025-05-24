import { Link, createFileRoute } from "@tanstack/react-router";
import { forwardRef, useMemo, useState } from "react";
import runsData from "../data/runs.json";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { VirtuosoGrid, type GridComponents } from "react-virtuoso";
import { Input } from "../components/ui/input";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AudioGuidedRun } from "@/data/runs.json.d";
import { Run } from "@/components/icons/Run";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

type RunType =
  | "Fartlek"
  | "Hill"
  | "Easy Run"
  | "Intervals"
  | "Tempo"
  | "Long Run"
  | "Race"
  | "Recovery"
  | "Walk"
  | "Treadmill"
  | "Pregnancy"
  | `Other`;
function getRunType(run: AudioGuidedRun): RunType {
  const [, runType] = run.landing.subtitle.split(/ . /);
  if (!runType) {
    return "Other";
  }

  const lowerRunType = runType.toLowerCase();

  if (lowerRunType.includes("treadmill")) {
    return "Treadmill";
  }

  if (run.landing.title.toLowerCase().includes("trimester")) {
    return "Pregnancy";
  }

  if (lowerRunType.includes("fartlek")) {
    return "Fartlek";
  }

  if (lowerRunType.includes("hill")) {
    return "Hill";
  }

  if (lowerRunType.includes("easy")) {
    return "Easy Run";
  }

  if (lowerRunType.includes("interval") || lowerRunType.includes("speed")) {
    return "Intervals";
  }

  if (lowerRunType.includes("long")) {
    return "Long Run";
  }

  if (lowerRunType.includes("race") || run.id === "10K_RACE") {
    return "Race";
  }

  if (lowerRunType.includes("recovery")) {
    return "Recovery";
  }

  if (lowerRunType.includes("tempo")) {
    return "Tempo";
  }

  if (lowerRunType.includes("walk")) {
    return "Walk";
  }

  return "Other";
}

const enrichedRuns = runsData.data.audioGuidedRuns.map((run) => ({
  ...run,
  runType: getRunType(run),
  runDetails: run.detail.content.find((content) => content.type === "TEXT" && content.title === "Run Details"),
}));

function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState<string>("all");

  // Get unique activity types
  const activityTypes = useMemo(() => {
    const types = new Set(enrichedRuns.map((run) => run.runType));
    return Array.from(types).sort();
  }, [enrichedRuns]);

  const filteredRuns = enrichedRuns.filter((run) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      run.landing.title.toLowerCase().includes(searchLower) ||
      run.landing.subtitle.toLowerCase().includes(searchLower) ||
      run.runDetails?.body?.toLowerCase().includes(searchLower);

    const matchesActivityType = selectedActivityType === "all" || run.runType === selectedActivityType;
    return matchesSearch && matchesActivityType;
  });

  const handleOpenInApp = (id: string) => {
    const url = `https://nikerunclub.sng.link/A6sko/96h7?_dl=x-callback-url/audioguidedrun/details?id%3D${id}`;
    window.open(url, "_blank");
  };

  const components = useMemo(
    (): GridComponents => ({
      Header: () => (
        <div className="container mx-auto p-4 pb-0">
          <h1 className="text-2xl font-bold mb-6 select-none">
            <span className="text-primary">
              <Run className="w-6 h-6 mr-1.5 -mt-[3px] inline-block" />
              NRC
            </span>{" "}
            Guided Runs
          </h1>
          <div className="mb-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              type="search"
              placeholder="Search runs by name..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedActivityType} onValueChange={setSelectedActivityType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
      List: forwardRef((props, ref) => {
        return (
          <div
            {...props}
            className={cn(
              "container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
              props.className,
            )}
            ref={ref}
          />
        );
      }),
      Footer: () => <Footer />,
    }),
    [searchQuery, selectedActivityType, activityTypes],
  );

  return (
    <VirtuosoGrid
      style={{ height: "100%" }}
      data={filteredRuns}
      className="w-full flex-1"
      components={components}
      itemContent={(_, run) => {
        const runDetails = run.runDetails;

        return (
          <Card
            key={run.id}
            asChild
            className={cn(
              "cursor-pointer transition-[background,scale]",
              "border-0 border-shine",
              "bg-foreground/5 hover:bg-foreground/10",
              "transform-sc hover:scale-[1.01]",
              "h-full",
              "flex flex-col",
              "select-none",
            )}
          >
            <Link to="/run/$runId" params={{ runId: run.id }}>
              <CardHeader className="gap-1">
                <CardTitle>{run.landing.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{run.landing.subtitle}</p>
              </CardHeader>
              <CardContent className="flex flex-col items-start flex-1">
                {runDetails?.body && (
                  <div
                    className="text-sm font-medium line-clamp-5"
                    dangerouslySetInnerHTML={{ __html: runDetails.body }}
                  />
                )}
                <div className="flex-1" />
                <Button
                  className="mt-6"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenInApp(run.id);
                  }}
                >
                  <Run />
                  Open in App
                </Button>
              </CardContent>
            </Link>
          </Card>
        );
      }}
    />
  );
}
