import type { Metadata } from "next";
import { Lightbulb, MessageSquareReply, Wrench } from "lucide-react";
import Reveal from "@/components/Reveal";
import RequestForm from "@/components/RequestForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a tool",
  description: "Describe a problem you keep running into and we may build the tool for it.",
};

const points = [
  { icon: Lightbulb, title: "Describe the problem", text: "Not the solution. What do you do by hand today?" },
  { icon: Wrench, title: "We look at every idea", text: "If it helps more people, it goes on the build list." },
  { icon: MessageSquareReply, title: "You get a reply", text: "By email, with questions or a download link." },
];

export default function ContactPage() {
  return (
    <main className="px-6 md:px-8 pt-10 md:pt-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
        <Reveal>
          <p className="eyebrow mb-3">Request a tool</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.04em]">
            Got a problem <span className="text-gradient">worth skipping?</span>
          </h1>
          <p className="mt-5 text-white/60 max-w-md leading-relaxed">
            Tell us what keeps slowing you down. The best tools here started as one person&apos;s annoying,
            repetitive task.
          </p>

          <ul className="mt-10 space-y-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid place-items-center shrink-0 w-11 h-11 rounded-2xl glass text-cyan">
                  <p.icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-white/50 mt-0.5">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-white/45">
            Prefer email? Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white/80 hover:text-cyan underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass gradient-border is-lit relative rounded-3xl p-6 md:p-9">
            <RequestForm />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
