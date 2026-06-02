import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Banner } from '../types';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  banners: Banner[];
  onActionClick: (bannerId: string) => void;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ banners, onActionClick }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(track.scrollLeft);
    track.style.cursor = 'grabbing';
    track.style.scrollSnapType = 'none';
    track.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    const dx = e.clientX - startX;
    trackRef.current.scrollLeft = scrollLeft - dx;
  }, [isDragging, startX, scrollLeft]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!trackRef.current) return;
    setIsDragging(false);
    trackRef.current.style.cursor = 'grab';
    trackRef.current.style.scrollSnapType = 'x mandatory';
    trackRef.current.releasePointerCapture(e.pointerId);
  }, []);

  // Initial scroll position in the middle set of banners
  useEffect(() => {
    const track = trackRef.current;
    if (!track || banners.length === 0) return;
    
    // Give it a tiny timeout to ensure layout is computed
    const timer = setTimeout(() => {
      const cardWidth = track.firstElementChild?.clientWidth || 400;
      const step = cardWidth + 20;
      track.scrollLeft = step * banners.length;
    }, 100);
    return () => clearTimeout(timer);
  }, [banners.length]);

  // Autoplay every 5 seconds (5000ms)
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track || banners.length === 0) return;
      
      const cardWidth = track.firstElementChild?.clientWidth || 400;
      const step = cardWidth + 20; // card width + gap
      
      track.scrollBy({ left: step, behavior: 'smooth' });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isDragging, banners.length]);

  // Infinite scroll silent reset
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || banners.length === 0 || isDragging) return;
    
    const cardWidth = track.firstElementChild?.clientWidth || 400;
    const step = cardWidth + 20;
    const singleSetWidth = step * banners.length;
    
    // If we've scrolled past the middle set, snap back silently
    if (track.scrollLeft >= singleSetWidth * 2) {
      track.scrollLeft -= singleSetWidth;
    } else if (track.scrollLeft <= singleSetWidth - step) {
      track.scrollLeft += singleSetWidth;
    }
  };

  // Arrow navigation
  const scrollBy = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstElementChild?.clientWidth || 400;
    const amount = direction === 'left' ? -(cardWidth + 20) : (cardWidth + 20);
    track.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Render a high-tech glowing mock product representation for each banner
  const renderBannerGraphics = (bannerId: string) => {
    switch (bannerId) {
      case 'banner-headset':
        return (
          <div className="cyber-render" style={{ width: '150px', height: '150px' }}>
            <div className="cyber-render-halo" style={{ width: '180px', height: '120px' }}></div>
            {/* Custom glowing headset vectors */}
            <div style={{
              width: '100px',
              height: '100px',
              border: '8px solid #ff5252',
              borderBottom: 'none',
              borderRadius: '50px 50px 0 0',
              position: 'relative'
            }}>
              {/* Ear pads */}
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '-16px',
                width: '26px',
                height: '42px',
                backgroundColor: '#171717',
                border: '3px solid #ff5252',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(255, 82, 82, 0.5)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                right: '-16px',
                width: '26px',
                height: '42px',
                backgroundColor: '#171717',
                border: '3px solid #ff5252',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(255, 82, 82, 0.5)'
              }} />
              {/* Mic */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '-6px',
                width: '40px',
                height: '6px',
                backgroundColor: '#a3a3a3',
                transform: 'rotate(25deg)',
                transformOrigin: 'left center',
                borderRadius: '4px'
              }}>
                <div style={{
                  position: 'absolute',
                  right: '0',
                  top: '-4px',
                  width: '12px',
                  height: '14px',
                  backgroundColor: '#ff5252',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          </div>
        );
      case 'banner-abduction':
        return (
          <div className="cyber-render animate-ufo" style={{ width: '140px', height: '140px', color: '#45e627' }}>
            <div className="cyber-render-halo purple" style={{ width: '190px', height: '90px' }}></div>
            {/* Custom UFO spaceship */}
            <div style={{
              width: '110px',
              height: '40px',
              backgroundColor: '#171717',
              border: '2.5px solid #45e627',
              borderRadius: '50%',
              position: 'relative',
              boxShadow: '0 0 15px rgba(69, 230, 39, 0.6)'
            }}>
              {/* Dome */}
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '35px',
                width: '40px',
                height: '24px',
                backgroundColor: 'rgba(69, 230, 39, 0.2)',
                border: '2px solid #45e627',
                borderRadius: '30px 30px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', position: 'relative', top: '-1px' }}>👽</span>
              </div>
              {/* Portlights */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px 14px 0 14px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'blink 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'blink 1.2s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'blink 0.8s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'blink 1.4s infinite' }} />
              </div>
              {/* Tractor beam */}
              <div style={{
                position: 'absolute',
                bottom: '-80px',
                left: '25px',
                width: '60px',
                height: '80px',
                background: 'linear-gradient(to bottom, rgba(69, 230, 39, 0.3), transparent)',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none'
              }} />
            </div>
          </div>
        );
      case 'banner-beach':
        return (
          <div className="cyber-render" style={{ width: '140px', height: '140px' }}>
            <span style={{ fontSize: '6rem', filter: 'drop-shadow(0 0 10px rgba(255, 126, 0, 0.4))' }}>🏖️</span>
            <span style={{ fontSize: '2.5rem', position: 'absolute', bottom: '0', right: '-10px', filter: 'drop-shadow(0 0 8px rgba(69, 230, 39, 0.6))' }}>👽</span>
          </div>
        );
      default:
        return <Sparkles size={60} className="neon-text" />;
    }
  };

  return (
    <div className="hero-section" style={{ overflow: 'hidden', paddingBottom: '16px', position: 'relative' }}>
      {/* Left Arrow */}
      <button
        onClick={() => scrollBy('left')}
        style={{
          position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(69,230,39,0.4)',
          backgroundColor: 'rgba(0,0,0,0.7)', color: '#45e627', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scrollBy('right')}
        style={{
          position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(69,230,39,0.4)',
          backgroundColor: 'rgba(0,0,0,0.7)', color: '#45e627', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}
      >
        <ChevronRight size={20} />
      </button>

      <div 
        ref={trackRef}
        className="hero-slider-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '16px',
          scrollbarWidth: 'none',
          cursor: 'grab',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[...banners, ...banners, ...banners].map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className={`hero-slide-item ${banner.bgStyle}`}
            style={{
              flex: '0 0 calc(42% - 20px)',
              minWidth: '320px',
              scrollSnapAlign: 'start',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden'
            }}
          >
            {/* Background Glow */}
            <div className="hero-skew-backdrop" style={{
              position: 'absolute',
              right: '-10%',
              bottom: '-10%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              filter: 'blur(40px)',
              backgroundColor: banner.id === 'banner-abduction' ? 'rgba(155, 81, 224, 0.4)' : 
                               banner.id === 'banner-beach' ? 'rgba(255, 126, 0, 0.4)' : 
                               'rgba(69, 230, 39, 0.4)',
              zIndex: 0
            }} />

            {/* Content */}
            <div className="hero-content" style={{ zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <span className="hero-badge badge-neon" style={{ alignSelf: 'flex-start' }}>
                👽 {banner.badge}
              </span>
              <h2 className="hero-title" style={{ fontSize: '1.6rem', marginTop: '12px' }}>{banner.title}</h2>
              <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginBottom: 'auto' }}>{banner.subtitle}</p>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '24px' }}>
                <div>
                  {banner.price > 0 && (
                    <div className="hero-pricing-box" style={{ marginBottom: '8px' }}>
                      <span className="hero-price neon-text" style={{ fontSize: '1.4rem' }}>
                        R$ {banner.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}
                  <button
                    className="neon-glow-btn"
                    style={{ padding: '8px 20px', fontSize: '0.75rem' }}
                    onClick={() => onActionClick(banner.id)}
                  >
                    {banner.buttonText}
                    <ArrowRight size={14} />
                  </button>
                </div>
                
                {/* Graphics */}
                <div style={{ width: '80px', height: '80px', transform: 'scale(0.8)', transformOrigin: 'bottom right' }}>
                  {renderBannerGraphics(banner.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
