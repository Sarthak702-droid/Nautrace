import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Radar,
  Route,
  Ship,
  Waves,
} from "lucide-react";
import LaunchButton from "./launch-button";

type MetricIconType = "radar" | "ship" | "route" | "waves";

interface MetricItem {
  id: string;
  label: string;
  value: string;
  changePercent: number;
  icon: MetricIconType;
}

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
}

const metricIconMap: Record<MetricIconType, React.ElementType> = {
  radar: Radar,
  ship: Ship,
  route: Route,
  waves: Waves,
};

const metrics: MetricItem[] = [
  { id: "m1", label: "Particles", value: "192", changePercent: 12, icon: "waves" },
  { id: "m2", label: "Envelopes", value: "50/90", changePercent: 8, icon: "radar" },
  { id: "m3", label: "AIS tracks", value: "Live", changePercent: 4, icon: "ship" },
  { id: "m4", label: "Unknown", value: "Safe", changePercent: 0, icon: "route" },
];

const activities: ActivityItem[] = [
  {
    id: "a1",
    title: "Hindcast ensemble complete",
    timestamp: "CASE-001 · just now",
  },
  {
    id: "a2",
    title: "Vessel ranking published",
    timestamp: "3 candidates · scored",
  },
  {
    id: "a3",
    title: "Evidence hash sealed",
    timestamp: "request · config locked",
  },
];

/** Compact centered CTA — text + phone close together */
export default function FinalCta({
  onLaunchConsole,
}: {
  onLaunchConsole: () => void;
}) {
  return (
    <section className="landing-section w-full">
      <div className="landing-shell">
        <div className="group relative isolate mx-auto flex w-full max-w-4xl items-center overflow-hidden rounded-3xl border border-white/12 bg-primary/5 px-6 py-12 sm:px-10 md:px-12 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(125,211,224,0.14),transparent_65%)]"
          />

          <div className="relative z-10 grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:gap-10">
            <div className="flex flex-col items-start gap-5 text-left">
              <p className="section-kicker !mb-0">Ready to investigate</p>
              <h2 className="section-title !mb-0 text-3xl tracking-tight sm:text-4xl">
                Open the{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  console
                </span>
              </h2>
              <p className="section-body max-w-sm !text-[1rem]">
                Run hindcast attribution, inspect vessel rankings, and keep an
                honest Unknown when the ocean evidence is not enough.
              </p>
              <LaunchButton label="Launch Console" onClick={onLaunchConsole} />
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-[280px]">
                <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-[#03080c] bg-[#061018] shadow-2xl shadow-cyan-950/40">
                  <div className="absolute top-2 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

                  <div className="relative h-[400px] overflow-hidden px-3.5 pt-10 pb-6">
                    <div className="space-y-4">
                      <div className="mb-1 flex items-center gap-2 text-primary">
                        <Activity className="h-3.5 w-3.5" />
                        <span className="font-mono text-[10px] tracking-wider uppercase">
                          Live case feed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {metrics.map((metric) => {
                          const Icon = metricIconMap[metric.icon];
                          const isPositive = metric.changePercent >= 0;

                          return (
                            <div
                              key={metric.id}
                              className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                            >
                              <div className="mb-2 flex items-center gap-1.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <Icon className="h-3 w-3" />
                                </div>
                                <span className="text-[10px] font-medium text-white/50">
                                  {metric.label}
                                </span>
                              </div>
                              <div className="mb-1 font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                                {metric.value}
                              </div>
                              <div
                                className={`flex items-center gap-1 text-[10px] font-semibold ${
                                  isPositive ? "text-primary" : "text-white/40"
                                }`}
                              >
                                {isPositive ? (
                                  <ArrowUpRight className="h-2.5 w-2.5" />
                                ) : (
                                  <ArrowDownRight className="h-2.5 w-2.5" />
                                )}
                                <span>{Math.abs(metric.changePercent)}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <div className="mb-2.5 flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-white">
                            Recent activity
                          </h3>
                          <span className="text-[10px] font-medium text-white/40">
                            Live
                          </span>
                        </div>
                        <div className="space-y-2">
                          {activities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#061018]/80 p-2.5"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5">
                                <Clock3 className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div className="min-w-0 text-left">
                                <p className="truncate text-xs font-medium text-white">
                                  {activity.title}
                                </p>
                                <p className="text-[10px] text-white/45">
                                  {activity.timestamp}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-1/2 z-20 h-1 w-20 -translate-x-1/2 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
