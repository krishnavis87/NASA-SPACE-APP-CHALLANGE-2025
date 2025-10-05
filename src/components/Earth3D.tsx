import { useRef, useEffect, useState } from 'react';

export const Earth3D = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is ready
    video.load();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    // Scrub through video based on mouse position (0 to duration)
    if (video.duration) {
      video.currentTime = percentage * video.duration;
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    const video = videoRef.current;
    if (video) {
      // Return to start position when mouse leaves
      video.currentTime = 0;
    }
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full max-w-[500px] h-full rounded-2xl overflow-hidden glass-panel cursor-pointer transition-all duration-300 hover:scale-105"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          boxShadow: isHovering 
            ? '0 0 40px rgba(74, 158, 255, 0.6), 0 0 80px rgba(74, 158, 255, 0.3)' 
            : '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/earth-rotation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none transition-opacity duration-300"
          style={{ opacity: isHovering ? 0 : 1 }}
        >
          Move mouse to rotate Earth
        </div>

        {/* Atmospheric glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-blue-900/20 pointer-events-none" />
      </div>
    </div>
  );
};
