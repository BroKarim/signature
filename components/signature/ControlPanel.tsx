export default function ControlPanel() {
  return (
    <div className="hidden w-[500px] flex-col gap-4 overflow-y-auto bg-[#181819] shadow-dzenn border-none rounded-2xl lg:flex no-scrollbar">
      <div className="px-6 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9C6C3]">
          Control Panel
        </div>
        <div className="mt-2 text-sm text-[#9D9893]">Defaults only for MVP (locked).</div>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-6">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#1F1F20] px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8B4AF]">
            Animation Speed
          </div>
          <div className="mt-2 text-sm text-white">2.6s total</div>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#1F1F20] px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8B4AF]">
            Stroke Thickness
          </div>
          <div className="mt-2 text-sm text-white">Min 1.2 / Max 3.6</div>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#1F1F20] px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8B4AF]">
            Stroke Color
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-6 w-6 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#2C2826]" />
            <div className="text-sm text-white">#2C2826</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#1F1F20] px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8B4AF]">
            Ghost Effect
          </div>
          <div className="mt-2 text-sm text-white">Enabled</div>
        </div>

        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#1F1F20] px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8B4AF]">
            Easing
          </div>
          <div className="mt-2 text-sm text-white">Natural</div>
        </div>
      </div>
    </div>
  );
}
