import { Link, createFileRoute, useElementScrollRestoration } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import type { VirtualItem } from "@tanstack/react-virtual";
import type { ChangeEvent } from "react";
import type { RunType } from "@/data/endrichedRuns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Run } from "@/components/icons/Run";
import { Footer } from "@/components/Footer";
import { ENRICHED_RUNS } from "@/data/endrichedRuns";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

let cache: VirtualItem[] = [];
function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState<"all" | RunType>("all");

  // Get unique activity types
  const activityTypes = useMemo(() => {
    const types = new Set(ENRICHED_RUNS.map((run) => run.runType));
    return Array.from(types).sort();
  }, []);

  const filteredRuns = ENRICHED_RUNS.filter((run) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      run.landing.title.toLowerCase().includes(searchLower) ||
      run.landing.subtitle.toLowerCase().includes(searchLower) ||
      run.runDetails?.body?.toLowerCase().includes(searchLower);

    const matchesActivityType = selectedActivityType === "all" || run.runType === selectedActivityType;
    return matchesSearch && matchesActivityType;
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollEntry = useElementScrollRestoration({
    getElement: () => window,
  });
  const virtualizer = useWindowVirtualizer({
    count: filteredRuns.length,
    estimateSize: () => 256,
    overscan: 5,
    initialOffset: scrollEntry?.scrollY,
    initialMeasurementsCache: cache,
    getItemKey: (index) => filteredRuns[index].id,
    gap: 32,
  });
  cache = virtualizer.measurementsCache;

  const handleOpenInApp = (id: string) => {
    const url = `https://nikerunclub.sng.link/A6sko/96h7?_dl=x-callback-url/audioguidedrun/details?id%3D${id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="mx-auto container max-w-3xl">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedActivityType={selectedActivityType}
        setSelectedActivityType={setSelectedActivityType}
        activityTypes={activityTypes}
      />
      <div
        ref={listRef}
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          console.log(item);

          const run = filteredRuns[item.index];
          const runDetails = run.runDetails;

          return (
            <div
              ref={virtualizer.measureElement}
              data-index={item.index}
              key={run.id}
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(${item.start}px)` }}
            >
              <Card
                asChild
                className={cn(
                  "cursor-pointer transition-[background,scale]",
                  "border-0 border-shine",
                  "bg-foreground/5 hover:bg-foreground/10",
                  "transform-sc hover:scale-[1.01]",
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
            </div>
          );
        })}
      </div>
      <Footer className="py-12" />
    </div>
  );
}

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  selectedActivityType: "all" | RunType;
  setSelectedActivityType: (selectedActivityType: "all" | RunType) => void;
  activityTypes: Array<RunType>;
}
const Header = ({
  searchQuery,
  setSearchQuery,
  selectedActivityType,
  setSelectedActivityType,
  activityTypes,
}: HeaderProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6 mt-4 select-none">
        <span className="text-primary">
          <Run className="w-6 h-6 mr-1.5 -mt-[3px] inline-block" />
          NRC
        </span>{" "}
        Guided Runs
      </h1>
      <div className="mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </>
  );
};
