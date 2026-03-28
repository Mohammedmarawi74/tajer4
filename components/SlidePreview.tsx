import React from "react";
import { SlideData } from "../types";

interface Props {
  slide: SlideData;
}

const SlidePreview: React.FC<Props> = ({ slide }) => {
  // Helper to determine if background is dark for contrast adjustments
  const isDarkBg =
    slide.backgroundColor === "#1e1e1e" || 
    slide.backgroundColor === "#0f172a" ||
    slide.backgroundColor === "#1E293B";

  return (
    <div
      className="slide-preview"
      dir="rtl"
      style={{ 
        backgroundColor: slide.backgroundColor, 
        color: slide.textColor,
        fontFamily: '"IBM Plex Sans Arabic", sans-serif'
      }}
    >
      {/* Custom CSS Injection */}
      {slide.customCss && <style>{slide.customCss}</style>}

      {/* Decorative Background Pattern */}
      <div
        className="slide-bg-pattern"
        style={{
          opacity: isDarkBg ? 0.03 : 0.05,
          filter: isDarkBg ? "invert(1)" : "none",
        }}
      ></div>

      {/* Subtle Gradient Overlay - Linear */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${slide.themeColor}10 0%, transparent 40%, ${slide.themeColor}08 100%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Radial Gradient for Depth */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "150%",
          height: "100%",
          background: `radial-gradient(ellipse at center, ${slide.themeColor}06 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Logo Rendering */}
      {slide.logoUrl && (
        <div className="slide-logo-container">
          <img src={slide.logoUrl} alt="Logo" className="slide-logo-img" />
        </div>
      )}

      {/* Content Container */}
      <div className="slide-content-wrapper">
        {/* Title with Modern Typography */}
        <h2 
          className="slide-title" 
          style={{ 
            color: slide.textColor,
            textShadow: isDarkBg ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {slide.title}
        </h2>

        {/* Subtitle with Soft Background Highlight */}
        <div className="slide-subtitle-wrapper">
          <div
            className="slide-subtitle-bg"
            style={{ 
              backgroundColor: slide.themeColor, 
              opacity: 0.08,
              borderRadius: '20px',
            }}
          ></div>
          <p
            className="slide-subtitle"
            style={{ 
              color: slide.textColor, 
              opacity: 0.9,
              fontFamily: '"IBM Plex Sans Arabic", sans-serif',
            }}
          >
            {slide.subtitle.split(/(\d+)/).map((part, i) =>
              /\d+/.test(part) ? (
                <span
                  key={i}
                  className="slide-highlight"
                  style={{ 
                    color: slide.themeColor,
                    fontWeight: 700,
                  }}
                >
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </p>
        </div>

        {/* Percentage Highlight with Gradient */}
        <div className="slide-percentage-wrapper">
          <div className="slide-percentage-container">
            <span
              className="slide-percentage-shadow"
              style={{ color: slide.textColor, opacity: 0.05 }}
            >
              {slide.percentage}
            </span>
            <span
              className="slide-percentage-main"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                gap: '0.5rem',
              }}
            >
              <span style={{ 
                color: slide.textColor, 
                opacity: 0.6,
                fontSize: '0.6em',
                fontWeight: 500,
              }}>
                بنسبة
              </span>
              <span 
                className="slide-percentage-number"
                style={{
                  color: slide.themeColor,
                  fontWeight: 900,
                }}
              >
                {slide.percentage}
              </span>
            </span>
          </div>
        </div>

        {/* Comparative Values Section with Card Style */}
        <div 
          className="slide-stats-grid"
          style={{
            background: isDarkBg 
              ? `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)`
              : `linear-gradient(180deg, ${slide.themeColor}08 0%, transparent 100%)`,
            borderRadius: '20px',
          }}
        >
          <div className="slide-stat-left">
            <div
              className="slide-stat-value"
              style={{ 
                color: slide.textColor,
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
              }}
            >
              {slide.val1}
            </div>
            <div
              className="slide-stat-label"
              style={{ 
                color: slide.textColor, 
                opacity: 0.6,
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
              }}
            >
              {slide.label1}
            </div>
          </div>

          <div className="slide-comparison-wrapper">
            <div
              className="slide-comparison-badge"
              style={{ 
                backgroundColor: slide.themeColor,
                borderRadius: '9999px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {slide.comparisonLabel}
            </div>
          </div>

          <div className="slide-stat-right">
            <div
              className="slide-stat-value"
              style={{ 
                color: slide.textColor,
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
              }}
            >
              {slide.val2}
            </div>
            <div
              className="slide-stat-label"
              style={{ 
                color: slide.textColor, 
                opacity: 0.6,
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
              }}
            >
              {slide.label2}
            </div>
          </div>
        </div>

        {/* Detailed Description with Separator */}
        <div
          className="slide-description-wrapper"
          style={{ 
            borderTop: `1px solid ${slide.textColor}15`,
            paddingTop: '1.25rem',
          }}
        >
          <p
            className="slide-description"
            style={{ 
              color: slide.textColor, 
              opacity: 0.85,
              fontFamily: '"IBM Plex Sans Arabic", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            {slide.description
              .split(/(\d+%?|\d+ مليون دولار)/)
              .map((part, i) =>
                /(\d+%?|\d+ مليون دولار)/.test(part) ? (
                  <span
                    key={i}
                    className="slide-desc-highlight"
                    style={{ 
                      color: slide.themeColor,
                      fontWeight: 700,
                    }}
                  >
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
          </p>
        </div>
      </div>

      {/* Footer Visual Section with Modern Glow */}
      <div className="slide-footer">
        {/* Background Glow Element */}
        <div
          className="slide-footer-glow"
          style={{ 
            backgroundColor: slide.themeColor, 
            opacity: 0.15,
            filter: 'blur(60px)',
          }}
        ></div>

        {/* Illustrative Image with Rounded Corners */}
        <div className="slide-image-container">
          <img
            src={slide.footerImage}
            alt="Footer Visual"
            crossOrigin="anonymous"
            className="slide-footer-img"
            style={{
              borderRadius: '20px',
            }}
          />
        </div>
      </div>

      {/* Modern Branding Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "32px",
          right: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          opacity: 0.75,
          fontSize: "16px",
          fontFamily: '"IBM Plex Sans Arabic", sans-serif',
          fontWeight: 600,
        }}
      >
        <span 
          style={{ 
            color: slide.textColor,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: slide.themeColor,
            }}
          />
          منصة التاجر الرقمية
        </span>
        <span
          style={{
            color: slide.textColor,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: '"IBM Plex Sans Arabic", sans-serif',
            fontSize: '14px',
            letterSpacing: '0.5px',
          }}
        >
          dtajer
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${slide.themeColor} 0%, ${slide.secondaryColor} 100%)`,
              boxShadow: `0 2px 8px ${slide.themeColor}40`,
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default SlidePreview;
