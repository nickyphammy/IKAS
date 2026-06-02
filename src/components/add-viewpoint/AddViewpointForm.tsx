import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import FormLabel from './FormLabel'
import ImageDropZone from './ImageDropZone'
import StarRating from './StarRating'

export default function AddViewpointForm() {
  return (
    <div className="motion-fade-in relative w-full min-w-0 max-w-[1040px] rounded-lg bg-[#fff7ef] px-4 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
      <Link
        to="/home"
        className="absolute left-5 top-5 text-[16px] font-bold text-[#9f9f9f] hover:text-black lg:left-8"
        aria-label="Close"
      >
        X
      </Link>

      <h1 className="mb-6 text-center text-[24px] font-bold text-black">
        add a spot
      </h1>

      <form
        className="flex flex-col gap-6"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="w-full lg:w-[440px] lg:shrink-0">
            <ImageDropZone />
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <div>
              <FormLabel required>where is it?</FormLabel>
              <input
                type="text"
                placeholder="orange county"
                className="motion-focus h-10 w-full rounded-[24px] bg-white px-5 text-[16px] text-black placeholder:text-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#ff9e43]"
              />
            </div>

            <StarRating />

            <div>
              <FormLabel optional>description</FormLabel>
              <textarea
                rows={5}
                className="motion-focus h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-[#ff9e43]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="accent"
            className="h-12 w-full max-w-[520px] rounded-xl text-[16px]"
          >
            submit
          </Button>
        </div>
      </form>
    </div>
  )
}
