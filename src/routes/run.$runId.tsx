import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/data/runs.json.d";
import { Button } from "@/components/ui/button";
import { ENRICHED_RUNS } from "@/data/endrichedRuns";
import { Run } from "@/components/icons/Run";
import { cn } from "@/lib/utils";
import { AppleMusic } from "@/components/icons/AppleMusic";
import { Spotify } from "@/components/icons/Spotify";
import { Footer } from "@/components/Footer";
import { useImageLoadState } from "@/hooks/useImageLoadState";

export const Route = createFileRoute("/run/$runId")({
  component: RunDetailsPage,
});

function RunDetailsPage() {
  const { runId } = Route.useParams();
  const run = ENRICHED_RUNS.find((r) => r.id === runId);
  const { loadingState, imgProps } = useImageLoadState(run?.detail.headerCard.url);

  const handleOpenInApp = (id: string) => {
    const url = `https://nikerunclub.sng.link/A6sko/96h7?_dl=x-callback-url/audioguidedrun/details?id%3D${id}`;
    window.open(url, "_blank");
  };

  const [isBottomButtonVisible, setIsBottomButtonVisible] = useState(false);
  const startRunButtonInHeaderRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!startRunButtonInHeaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsBottomButtonVisible(false);
        } else {
          setIsBottomButtonVisible(true);
        }
      });
    });

    observer.observe(startRunButtonInHeaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const loadingImageClassNames = cn("transition-opacity duration-500 opacity-0", {
    "opacity-100": loadingState === "loaded",
  });

  if (!run) {
    return <div>Run not found</div>;
  }

  return (
    <>
      <div>
        <div className="w-full aspect-[4/5] md:aspect-[2/1] relative overflow-clip">
          <img
            draggable={false}
            {...imgProps}
            alt=""
            className={cn(
              "w-full h-full object-cover object-top md:blur-3xl md:scale-150 select-none",
              loadingImageClassNames,
            )}
          />
          <img
            draggable={false}
            src={run.detail.headerCard.url}
            alt=""
            className={cn(
              "max-md:hidden absolute top-0 w-full h-full object-contain object-top select-none",
              loadingImageClassNames,
            )}
          />
          <div className="absolute top-0 left-0 w-full">
            <div className="absolute inset-0 -bottom-16 fadeout-to-bottom" />
            <div className="absolute inset-0 -bottom-2 mask-gradient-to-b mask-b-from-0 backdrop-blur-md" />

            <div className="relative container mx-auto p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button onClick={() => window.history.back()} variant="ghost" className="text-white">
                  <ChevronLeft className="w-6! h-6!" />
                  <div className="font-bold select-none">
                    <span className="text-primary">
                      <Run className="w-6 h-6 mr-1.5 -mt-[3px] inline-block" />
                      NRC
                    </span>
                    <span className="max-md:hidden"> Guided Runs</span>
                  </div>
                </Button>
              </div>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenInApp(run.id);
                }}
                className="md:hidden"
                ref={startRunButtonInHeaderRef}
              >
                <Run />
                Open in App
              </Button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full">
            <div className="absolute inset-0 -top-32 fadeout-to-top" />
            <div className="absolute inset-0 -top-16 mask-gradient-to-t backdrop-blur-md mask-t-from-16" />
            <div className="relative container mx-auto p-4 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">{run.detail.headerCard.title}</h1>
                <p className="text-muted-foreground mt-1">{run.runType}</p>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenInApp(run.id);
                }}
                className="max-md:hidden"
              >
                <Run />
                Open in App
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 space-y-4 relative">
        <div className="space-y-8">
          {run.detail.content.map((content, index) => (
            <RunSectionContents content={content} key={index} />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "relative max-md:sticky bottom-0 left-0 pb-4 w-full flex justify-center z-10",
          "max-md:opacity-0 transition-[opacity] duration-300",
          {
            "max-md:opacity-100": isBottomButtonVisible,
          },
        )}
      >
        <div className="md:hidden absolute inset-0 -top-4 backdrop-blur-xs mask-t-from-[32px]" />
        <div className="md:hidden absolute inset-0 -top-4 fadeout-to-top" />

        <Button
          onClick={(e) => {
            e.preventDefault();
            handleOpenInApp(run.id);
          }}
          size="lg"
          className={cn("max-md:scale-90 transition-[scale] duration-300", {
            "max-md:scale-100": isBottomButtonVisible,
          })}
        >
          <Run />
          Open in App
        </Button>
      </div>
      <Footer />
    </>
  );
}

interface RunSectionProps {
  content: Content;
}
const RunSectionContents = (props: RunSectionProps) => {
  const { content } = props;
  const headingClassName = cn("text-2xl font-bold mb-1");

  if (content.type === "MUSIC") {
    return (
      <section>
        <h2 className={cn(headingClassName, "mb-3")}>Suggested Music</h2>
        <div className="flex gap-4 items-stretch">
          <div className="w-18 h-18 rounded-sm relative">
            <img src={content.url} className="w-full h-full object-cover rounded-[inherit]" alt="" />
            <div className="absolute inset-0 inset-ring inset-ring-foreground/10 rounded-[inherit]" />
          </div>
          <div className="flex flex-col justify-between">
            <div className="text-xl font-bold">{content.title}</div>
            <div className="flex gap-2 items-start">
              {content.providers.map((provider) => (
                <Button
                  key={provider.type}
                  asChild
                  variant="secondary"
                  className={cn("no-underline align-start", {
                    "bg-[#e64d58] hover:bg-[#e64d58]/80": provider.type === "APPLE_MUSIC",
                    "bg-[#65d46e] hover:bg-[#65d46e]/80 text-black": provider.type === "SPOTIFY",
                  })}
                >
                  <a key={provider.type} href={provider.url} target="_blank" rel="noopener noreferrer">
                    {provider.type === "APPLE_MUSIC" ? (
                      <>
                        <AppleMusic className="w-5 h-5" />
                        Apple Music
                      </>
                    ) : provider.type === "SPOTIFY" ? (
                      <>
                        <Spotify className="w-5 h-5" />
                        Spotify
                      </>
                    ) : (
                      provider.type
                    )}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (content.body) {
    return (
      <section>
        <h2 className={headingClassName}>{content.title}</h2>
        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.body }} />
      </section>
    );
  }

  return (
    <section>
      <h2 className={headingClassName}>{content.title}</h2>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </section>
  );
};
