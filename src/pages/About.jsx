import PageLayout from "../components/layout/PageLayout";
import GlassCard from "../components/common/GlassCard";
import {
  IconLeaf,
  IconTarget,
  IconSparkles,
  IconAward,
} from "../components/common/Icons";

const METHOD_STEPS = [
  {
    icon: IconTarget,
    title: "You log four daily habits",
    desc: "Transportation, electricity usage, food preference, and plastic usage — the categories that drive most personal daily emissions.",
  },
  {
    icon: IconLeaf,
    title: "We estimate kg CO₂e per category",
    desc: "Each choice maps to an illustrative average emissions figure, summed into a single daily carbon score.",
  },
  {
    icon: IconSparkles,
    title: "You get tailored recommendations",
    desc: "Suggestions are generated from your specific combination of choices, not a generic checklist.",
  },
  {
    icon: IconAward,
    title: "Challenges and badges reinforce habits",
    desc: "Completing real-world eco challenges earns points that unlock achievement tiers over time.",
  },
];

const STACK = [
  "Gemini API (for AI coaching)",
  "React 18 + Vite",
  "Tailwind CSS",
  "Recharts",
  "React Router",
  "Vercel",
];

export default function About() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 text-center">
          <p className="section-eyebrow">About CarbonWise AI</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-bark-200 sm:text-4xl">
            Awareness is the first step
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-bark-400 sm:text-base">
            Track your habits, get a daily carbon score, and receive tailored
            eco guidance in one simple app.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-5 font-display text-xl font-semibold text-bark-200">
            How the Score Works
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {METHOD_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <GlassCard key={step.title} className="p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-moss-500/12 text-moss-400 ring-1 ring-moss-500/20">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="mt-3 font-display text-sm font-semibold text-bark-200">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-bark-400">
                    {step.desc}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section className="mb-12">
          <GlassCard className="p-6">
            <h2 className="font-display text-lg font-semibold text-bark-200">
              A note on Accuracy
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bark-400">
              The kg CO₂e values used here are simplified, illustrative averages
              meant to build intuition and spark better habits — not certified
              carbon accounting. Real emissions vary by region, vehicle type,
              energy grid mix, and many other factors. Use CarbonWise AI as a
              reflection tool, not a precise measurement instrument.
            </p>
          </GlassCard>
        </section>

        <section className="mb-12">
          <GlassCard className="p-6">
            <h2 className="font-display text-lg font-semibold text-bark-200">
              Privacy First
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-bark-400">
              There is no backend, no database, and no account system. Every
              entry, challenge, and point total is stored in your browser's
              local storage and never leaves your device — except, optionally,
              the inputs sent to Google's Gemini API if you choose to add your
              own API key for live AI coaching.
            </p>
          </GlassCard>
        </section>
      </div>
    </PageLayout>
  );
}
