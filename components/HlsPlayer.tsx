import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
    src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls;

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(error => console.log("Autoplay was prevented:", error));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support on Safari
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(error => console.log("Autoplay was prevented:", error));
            });
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video 
            ref={videoRef} 
            controls 
            className="w-full h-full"
            autoPlay
        />
    );
};

export default HlsPlayer;
