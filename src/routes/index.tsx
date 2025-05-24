import { Link, createFileRoute, useElementScrollRestoration, useSearch } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import type { VirtualItem } from "@tanstack/react-virtual";
import type { RunType } from "@/data/endrichedRuns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Run } from "@/components/icons/Run";
import { Footer } from "@/components/Footer";
import { ENRICHED_RUNS } from "@/data/endrichedRuns";
import { BULLET_POINT, NARROW_NON_BREAKING_SPACE, NON_BREAKING_SPACE } from "@/lib/text";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || undefined,
    };
  },
  component: IndexPage,
});

const UNSELECTED_ACTIVITY_TYPES: RunType[] = ["Pregnancy", "Race", "Walk", "Treadmill"];
let cache: VirtualItem[] = [];
function IndexPage() {
  const search = useSearch({ from: "/" });
  const [searchQuery, setSearchQuery] = useState(search.q || "");

  // Get unique activity types
  const activityTypes = useMemo(() => {
    const types = new Set(ENRICHED_RUNS.map((run) => run.runType));
    return Array.from(types).sort();
  }, []);

  const selectedActivityTypesByDefault = useMemo(() => {
    return activityTypes.filter((type) => !UNSELECTED_ACTIVITY_TYPES.includes(type));
  }, [activityTypes]);

  const [selectedActivityTypes, setSelectedActivityTypes] = useState<RunType[]>(selectedActivityTypesByDefault);

  const filteredRuns = ENRICHED_RUNS.filter((run) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      run.landing.title.toLowerCase().includes(searchLower) ||
      run.landing.subtitle.toLowerCase().includes(searchLower) ||
      run.runDetails?.body?.toLowerCase().includes(searchLower);

    const matchesActivityType = selectedActivityTypes.includes(run.runType);
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
    <>
      <div className="h-4 sticky top-0 left-0 w-full z-10">
        <div className="absolute inset-0 mask-gradient-to-b mask-b-from-0 backdrop-blur-xs" />
        <div className="absolute inset-0 fadeout-to-bottom"></div>
      </div>
      <div className="mx-auto container p-4 pb-0 max-w-3xl">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value);
            // Update URL search params

            window.history.replaceState({}, "", value ? `?q=${encodeURIComponent(value)}` : window.location.pathname);
          }}
          selectedActivityTypes={selectedActivityTypes}
          setSelectedActivityTypes={setSelectedActivityTypes}
          activityTypes={activityTypes}
          selectedActivityTypesByDefault={selectedActivityTypesByDefault}
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
            const run = filteredRuns[item.index];
            const runDetails = run.runDetails;

            const propertyGoal = formatGoal(run.properties.goal, run.properties.activityType);

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
                      <p className="text-sm text-muted-foreground">
                        {run.runType} {BULLET_POINT} {propertyGoal}
                      </p>
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
      </div>
      <Footer className="py-12" />
    </>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (seconds === 0) {
    return `${minutes} min`;
  }

  const minutesPart = minutes + NARROW_NON_BREAKING_SPACE + "min";
  const secondsPart = seconds.toString().padStart(2, "0") + NARROW_NON_BREAKING_SPACE + "sec";

  if (seconds === 0) {
    return minutesPart;
  }

  return minutesPart + NON_BREAKING_SPACE + secondsPart;
}

function formatGoal(goal: number, activityType: "DURATION" | "DISTANCE" | "SPEED_DURATION") {
  if (activityType === "SPEED_DURATION" || activityType === "DURATION") {
    return formatTime(goal);
  }

  const distance = (goal / 1000).toFixed(2);
  return distance + NARROW_NON_BREAKING_SPACE + "km";
}

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  selectedActivityTypes: RunType[];
  setSelectedActivityTypes: React.Dispatch<React.SetStateAction<RunType[]>>;
  activityTypes: Array<RunType>;
  selectedActivityTypesByDefault: RunType[];
}

const Header = ({
  searchQuery,
  setSearchQuery,
  selectedActivityTypes,
  setSelectedActivityTypes,
  activityTypes,
  selectedActivityTypesByDefault,
}: HeaderProps) => {
  const handleTypeToggle = (type: RunType) => {
    setSelectedActivityTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleSelectAll = () => {
    setSelectedActivityTypes(activityTypes);
  };

  const handleUnselectAll = () => {
    setSelectedActivityTypes([]);
  };

  const handleReset = () => {
    setSelectedActivityTypes(selectedActivityTypesByDefault);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 select-none">
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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-start">
              {selectedActivityTypes.length === activityTypes.length
                ? "All selected"
                : `${selectedActivityTypes.length} selected`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="select-none">Activity Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex gap-2 px-2 py-1.5">
              <Button variant="outline" size="sm" className="flex-1 h-8" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-8" onClick={handleUnselectAll}>
                Unselect All
              </Button>
              <Button variant="outline" size="sm" className="flex-1 h-8" onClick={handleReset}>
                Reset
              </Button>
            </div>
            <DropdownMenuSeparator />
            {activityTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedActivityTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
