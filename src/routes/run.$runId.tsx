import { createFileRoute } from "@tanstack/react-router";
import runsData from "../data/runs.json";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/run/$runId")({
  component: RunDetailsPage,
});

function RunDetailsPage() {
  const { runId } = Route.useParams();
  const run = runsData.data.audioGuidedRuns.find((r) => r.id === runId);

  if (!run) {
    return <div>Run not found</div>;
  }

  const handleOpenInApp = (id: string) => {
    const url = `https://nikerunclub.sng.link/A6sko/96h7?_dl=x-callback-url/audioguidedrun/details?id%3D${id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => window.history.back()} variant="link">
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">{run.detail.headerCard.title}</h1>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">{run.detail.headerCard.subtitle}</p>
        {run.detail.content.map((content, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
            </CardHeader>
            {content.body ? (
              <CardContent>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: content.body }} />
              </CardContent>
            ) : content.type === "MUSIC" ? (
              <CardContent>
                <div className="flex flex-col gap-4">
                  {content.providers.map((provider) => (
                    <a
                      key={provider.type}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neon-600 hover:text-neon-800"
                    >
                      {provider.type === "APPLE_MUSIC" ? (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          Apple Music
                        </>
                      ) : provider.type === "SPOTIFY" ? (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                          </svg>
                          Spotify
                        </>
                      ) : (
                        provider.type
                      )}
                    </a>
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <pre>{JSON.stringify(content, null, 2)}</pre>
              </CardContent>
            )}
          </Card>
        ))}
        <div className="flex justify-end">
          <Button onClick={() => handleOpenInApp(run.id)} variant="default">
            Start Run
          </Button>
        </div>
      </div>
    </div>
  );
}
