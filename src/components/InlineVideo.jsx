import React, { useEffect, useRef } from 'react';

/* A video that autoplays inside its own frame, including on phones.

   Some mobile browsers open autoplaying video full screen unless the inline
   attributes are on the element *before* playback starts. So we leave off the
   `autoplay` attribute, set everything up first, then call play() ourselves.
   `muted` is also set by hand because React only sets it as a property, and
   mobile autoplay requires it.

   Without `controls`, the video ignores taps (see .inline-video in App.css),
   so a tap hits the surrounding link instead of opening the native player. */
const InlineVideo = ({ src, className = '', controls = false, ...props }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.muted = true;
    // Autoplay can still be refused (e.g. iOS Low Power Mode). That leaves the
    // video paused in its frame, which is fine.
    video.play()?.catch(() => {});
  }, [src]);

  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      className={`${controls ? '' : 'inline-video'} ${className}`.trim()}
      controls={controls}
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      {...props}
    />
  );
};

export default InlineVideo;
