export default function ImageDropZone() {
  return (
    <div className="flex h-full min-h-[513px] flex-col items-center justify-center rounded-lg bg-white p-8">
      <img
        src="/assets/add-viewpoint/drag-drop.png"
        alt=""
        className="mb-6 size-40 object-contain"
        aria-hidden
      />
      <p className="text-center text-xl leading-relaxed text-black">
        Drag &amp; drop
        <br />
        <span className="text-[#9f9f9f]">
          your files here or{' '}
          <button
            type="button"
            className="text-[#9f9f9f] underline hover:text-black"
          >
            upload
          </button>
        </span>
      </p>
    </div>
  )
}
