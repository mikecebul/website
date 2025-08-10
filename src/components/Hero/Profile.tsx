import { Media } from '../Media'
import type { Media as MediaType } from '@/payload-types'
import { imagesAsMedia } from '@/utilities/imagesAsMedia'

interface ProfileProps {
  images?: (MediaType | string)[] | null
  priority?: boolean
}

export const Profile = ({ images, priority = false }: ProfileProps) => {
  const validImages = imagesAsMedia(images)
  return (
    <div className="flex flex-col justify-center items-center relative">
      <svg
        id="visual"
        viewBox="0 0 900 600"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        className="w-full h-auto max-w-full scale-190 sm:scale-200"
      >
        <g transform="translate(450 300) scale(0.9)">
          <path
            d="M184.9 -206.6C236.9 -176.7 274.5 -115.9 282.2 -52.7C289.8 10.5 267.5 76 231 128.1C194.6 180.2 144.2 218.8 81.9 254C19.7 289.1 -54.3 320.7 -120.1 306.8C-186 292.9 -243.7 233.5 -276 165.3C-308.3 97.1 -315.1 20.1 -302.5 -53.7C-289.9 -127.5 -257.8 -198.2 -204.1 -227.8C-150.4 -257.4 -75.2 -245.9 -4.4 -240.6C66.4 -235.4 132.8 -236.4 184.9 -206.6"
            fill="currentColor"
            className="text-primary/20"
          ></path>
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Media
          className="relative"
          imgClassName="rounded-full z-10 w-32 w-64"
          resource={validImages[0] ?? '/profile_pic.jpg'}
          priority={priority}
        />
      </div>
    </div>
  )
}

export const Dots = () => (
    <svg
      id="dots"
      viewBox="0 0 900 600"
      width="900"
      height="600"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      className="w-11/12 h-full absolute -z-10"
    >
      <g fill="currentColor" className="text-yellow-400/10"
>
        <circle r="78" cx="216" cy="124"></circle>
        <circle r="34" cx="102" cy="334"></circle>
        <circle r="69" cx="251" cy="445"></circle>
        <circle r="39" cx="410" cy="286"></circle>
        <circle r="62" cx="633" cy="269"></circle>
        <circle r="76" cx="753" cy="488"></circle>
      </g>
    </svg>
  );
