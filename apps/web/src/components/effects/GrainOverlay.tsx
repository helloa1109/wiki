/**
 * 페이지 전역 노이즈 그레인 오버레이.
 * 인터랙션 없으므로 Server Component.
 * SVG 노이즈가 fixed 로 깔리고 mix-blend-mode: overlay 로 합성됨.
 */
export function GrainOverlay() {
    return (
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-[100]"
      />
    );
  }