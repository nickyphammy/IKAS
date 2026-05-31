import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import FormLabel from './FormLabel'
import ImageDropZone from './ImageDropZone'
import StarRating from './StarRating'

export default function AddViewpointForm() {
  return (
    <div className="relative w-full max-w-[1166px] rounded-lg bg-[#fff7ef] px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
      <Link
        to="/home"
        className="absolute left-6 top-8 text-2xl font-bold text-[#9f9f9f] hover:text-black lg:left-10"
        aria-label="Close"
      >
        X
      </Link>

      <h1 className="mb-10 text-center text-[32px] font-bold text-black">
        add a spot
      </h1>

      <form
        className="flex flex-col gap-10"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-[529px] lg:shrink-0">
            <ImageDropZone />
          </div>

          <div className="flex flex-1 flex-col gap-8">
            <div>
              <FormLabel required>where is it?</FormLabel>
              <input
                type="text"
                placeholder="orange county"
                className="h-[50px] w-full rounded-[32px] bg-white px-6 text-xl text-black placeholder:text-[#9f9f9f] focus:outline-none focus:ring-2 focus:ring-[#ff9e43]"
              />
            </div>

            <StarRating />

            <div>
              <FormLabel optional>description</FormLabel>
              <textarea
                rows={5}
                className="h-[154px] w-full resize-none rounded-[18px] bg-white px-5 py-4 text-xl text-black focus:outline-none focus:ring-2 focus:ring-[#ff9e43]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="accent"
            className="h-[60px] w-full max-w-[614px] rounded-2xl text-2xl"
          >
            submit
          </Button>
        </div>
      </form>
    </div>
  )
}
