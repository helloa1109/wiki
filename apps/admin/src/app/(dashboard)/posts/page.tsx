export default function PostsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">게시글</h1>
        <p className="mt-1 text-[14px] text-foreground-muted">게시글을 관리하세요.</p>
      </div>
      <div className="flex h-40 items-center justify-center rounded-xl border border-white/[0.06] bg-[hsl(var(--surface))]">
        <p className="text-[14px] text-foreground-subtle">준비 중</p>
      </div>
    </div>
  )
}
