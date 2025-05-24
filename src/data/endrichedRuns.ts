import runsData from "./runs.json";
import type { AudioGuidedRun } from "./runs.json.d.ts";

export type RunType =
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

export const ENRICHED_RUNS = (runsData as AudioGuidedRun[]).map((run) => ({
  ...run,
  runType: getRunType(run),
  runDetails: run.detail.content.find((content) => content.type === "TEXT" && content.title === "Run Details"),
  detail: {
    ...run.detail,
    content: run.detail.content.map((content) => {
      if (content.type !== "MUSIC") {
        return content;
      }

      return {
        ...content,
        providers: content.providers.map((provider) => {
          if (provider.type === "APPLE MUSIC") {
            return {
              ...provider,
              type: "APPLE_MUSIC",
            };
          }

          return provider;
        }),
      };
    }),
  },
}));
