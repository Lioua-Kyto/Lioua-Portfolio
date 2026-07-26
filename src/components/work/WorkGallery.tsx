"use client";

import { useState } from "react";
import type { Shot } from "@/content/schemas";
import { WorkStory } from "@/components/work/WorkStory";
import { ShotViewer } from "@/components/work/ShotViewer";

/**
 * Owns which capture is open. Kept apart from the story so the scroll
 * animations are not rebuilt every time the viewer opens or closes.
 */
export function WorkGallery({ shots }: { shots: readonly Shot[] }) {
  const [open, setOpen] = useState<Shot | null>(null);

  return (
    <>
      <WorkStory shots={shots} onOpen={setOpen} />
      <ShotViewer
        shot={open}
        onClose={() => {
          setOpen(null);
        }}
      />
    </>
  );
}
