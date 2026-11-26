// Pages that bring their own brand and frame instead of WASSCE Tutor's: the
// root layout (src/routes/__root.tsx) renders them without the student
// navigation, the public header or the footer.
//
// /beampad: BeamPad, the studio's Android TV keyboard and remote app
// (src/routes/beampad.*). Ad-free as well (isAdFreePath in src/lib/ads.ts).

// Keep in step with "page-scroll" in the boot script (src/routes/__root.tsx).
const STANDALONE_PATH = /^\/beampad(\/|$)/

export function isStandalonePath(pathname: string): boolean {
  return STANDALONE_PATH.test(pathname)
}
