import type { ComponentProps } from 'react'

export type StaticImageData = {
  src: string
  width: number
  height: number
  blurDataURL?: string
}

type ImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: string | StaticImageData
  fill?: boolean
  priority?: boolean
  preload?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  unoptimized?: boolean
}

export default function Image({
  src,
  fill,
  priority,
  preload,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  style,
  loading,
  width,
  height,
  ...props
}: ImageProps) {
  const image = typeof src === 'string' ? { src, width, height } : src
  return (
    <img
      {...props}
      src={image.src}
      width={fill ? undefined : (width ?? image.width)}
      height={fill ? undefined : (height ?? image.height)}
      loading={loading ?? (priority || preload ? 'eager' : 'lazy')}
      fetchPriority={priority || preload ? 'high' : undefined}
      decoding="async"
      style={
        fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style
      }
    />
  )
}
