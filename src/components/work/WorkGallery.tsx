"use client";

import { useState } from "react";
import type { Shot } from "@/content/schemas";
import { WorkStory } from "@/components/work/WorkStory";
import { ShotViewer } from "@/components/work/ShotViewer";

/**
 * Owns which capture is open. Kept apart from the story so the scroll
 * animations are not rebuilt every time the viewer opens or closes.
 */
export function WorkGallery({
  shots,
  host,
}: {
  shots: readonly Shot[];
  host?: string | null;
}) {
  const [open, setOpen] = useState<Shot | null>(null);
  // Where the viewer should grow from: the capture the reader actually clicked.
  const [origin, setOrigin] = useState<DOMRect | null>(null);

  return (
    <>
      <WorkStory
        shots={shots}
        host={host}
        onOpen={(shot, box) => {
          setOrigin(box);
          setOpen(shot);
        }}
      />
      <ShotViewer
        origin={origin}
        shot={open}
        onClose={() => {
          setOpen(null);
        }}
      />
    </>
  );
}
