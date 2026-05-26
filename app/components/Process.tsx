"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "UX / Wireframing",
    desc: "We start by understanding your goals and mapping out the user experience through wireframes and interactive prototypes.",
  },
  {
    num: "02",
    title: "Web Design",
    desc: "Transform wireframes into beautiful, on-brand visual designs that communicate your identity and engage your audience.",
  },
  {
    num: "03",
    title: "Web Development",
    desc: "Bring designs to life with clean, performant code that works seamlessly across all devices and browsers.",
  },
  {
    num: "04",
    title: "Analytics Setup / Support",
    desc: "Set up tracking and analytics so you can measure success, understand your users, and continuously improve over time.",
  },
];

export default function Process() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="process" className="px-24 py-28 border-t border-border">
      <div className="grid grid-cols-2 gap-16 items-start">

        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-4xl font-semibold leading-tight mb-6">
            My way of getting things done
          </h2>
          <p className="text-base text-muted leading-[1.8] max-w-[340px]">
            Fast and transparent, the path to owning a website that will
            represent your brand in the best of light is only 4 weeks away.
            Standing by the Waterfall methodology, I assure a step by step
            completion of the whole process.
          </p>
        </motion.div>

        <div className="border-t border-border divide-y divide-border">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="py-4"
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <button
                className="flex items-center justify-between w-full text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm">
                  <span className="text-muted mr-3">{s.num}.</span>
                  {s.title}
                </span>
                <span className="text-lg leading-none text-muted select-none group-hover:opacity-60 transition-opacity">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <motion.p
                  className="mt-3 text-[12px] text-muted leading-[1.75] pr-8"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {s.desc}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
