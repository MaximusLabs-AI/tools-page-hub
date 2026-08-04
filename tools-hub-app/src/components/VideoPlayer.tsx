'use client'

import {useState} from 'react'

export default function VideoPlayer({videoId, title}: {videoId: string; title: string}) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      className="video video-poster"
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <span className="video-poster__shade" />
      <span className="video-poster__play" aria-hidden="true">▶</span>
      <span className="video-poster__label">Play official product intro</span>
    </button>
  )
}
