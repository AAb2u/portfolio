"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import CircleOverlay, { CloseButton } from "./CircleOverlay";
import { closeOverlay, getOverlayState, subscribeOverlay } from "../lib/overlays";

const CV_URL = "/cv/cv%20(1).pdf";
const CV_FILENAME = "Abdenour-Akrour-CV.pdf";

type Status = "loading" | "ready" | "error";

// The CV button grows into this page, which renders the PDF with pdf.js:
// <iframe>/<embed> show nothing on Android and only page 1 on iOS.
export default function CvViewer() {
  const { kind, origin } = useSyncExternalStore(subscribeOverlay, getOverlayState, getOverlayState);
  const open = kind === "cv";
  const pagesRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const pdf = await pdfjs.getDocument(CV_URL).promise;
        const container = pagesRef.current;
        if (cancelled || !container) return;

        container.replaceChildren();
        // Render at the displayed width × pixel ratio so text stays crisp
        const cssWidth = Math.min(container.clientWidth || 860, 860);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          if (cancelled) return;
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (cssWidth / base.width) * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.className = "block h-auto w-full rounded-sm bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_40px_-12px_rgba(0,0,0,0.18)]";
          canvas.setAttribute("aria-label", `CV page ${n} of ${pdf.numPages}`);
          canvas.setAttribute("role", "img");
          container.appendChild(canvas);
          await page.render({ canvas, viewport }).promise;
          if (n === 1 && !cancelled) setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <CircleOverlay open={open} origin={origin} onClose={closeOverlay} label="Resume" onExitComplete={() => setStatus("loading")}>
      <div className="mx-auto w-full max-w-[860px] px-4 pb-16 pt-5 sm:px-8 sm:pt-6">
        {/* Slim top bar: the PDF itself is the page */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1677ff]">Resume</span>
          <div className="flex items-center gap-5">
            <a
              href={CV_URL}
              download={CV_FILENAME}
              className="text-[11px] uppercase tracking-[0.12em] text-[#111111]/55 underline-offset-4 transition-colors hover:text-[#111111] hover:underline"
            >
              Download ↓
            </a>
            <CloseButton onClick={closeOverlay} />
          </div>
        </div>

        <div className="mt-4 sm:mt-5">
          {status === "loading" && (
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#111111]/45">Loading resume…</p>
          )}
          {status === "error" && (
            <p className="text-sm text-[#111111]/60">
              The preview couldn&apos;t load.{" "}
              <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Open the PDF
              </a>
            </p>
          )}
          <div ref={pagesRef} className="flex flex-col gap-6" />
        </div>
      </div>
    </CircleOverlay>
  );
}
