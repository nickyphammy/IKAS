import { asset } from '../../lib/asset'

export default function ImageDropZone() {
  return (
    <div className="motion-pop group flex h-full min-h-[352px] flex-col items-center justify-center rounded-lg bg-white p-6">
      <img
        src={asset('assets/add-viewpoint/drag-drop.png')}
        alt=""
        className="mb-4 size-32 object-contain transition duration-300 group-hover:-translate-y-1 group-hover:rotate-1"
        aria-hidden
      />
      <p className="text-center text-[16px] leading-relaxed text-black">
        Drag &amp; drop
        <br />
        <span className="text-[#9f9f9f]">
          your files here or{' '}
          <button
            type="button"
            className="motion-press rounded px-1 text-[#9f9f9f] underline hover:text-black"
          >
            upload
          </button>
        </span>
      </p>
    </div>
  )
}
