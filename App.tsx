import React, { useState, useCallback, useRef } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Layers,
  Loader2,
  Code,
  Palette,
  Type as TypeIcon,
  Layout
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { SlideData } from './types';
import SlidePreview from './components/SlidePreview';
import EditorPanel from './components/EditorPanel';
import { generateProfessionalCopy } from './services/geminiService';

// Default Slide with dtajer Branding
const DEFAULT_SLIDE: SlideData = {
  id: Date.now().toString(),
  title: 'الصادرات الهندسية',
  subtitle: 'أعلن المجلس التصديري للصناعات الهندسية، ارتفاع الصادرات الهندسية خلال عام 2024',
  percentage: '%24.2',
  comparisonLabel: 'مقابل',
  val1: '4.392 مليار دولار',
  label1: 'في 2024',
  val2: '3.535 مليار دولار',
  label2: 'لنفس الفترة عام 2023',
  description: 'وكشف تقرير للمجلس التصديري للصناعات الهندسية أن الصادرات ارتفعت في أكتوبر 2024 بالمقارنة بنفس الشهر 2023 بنسبة 14% حيث بلغت 458 مليون دولار.',
  footerImage: 'https://picsum.photos/seed/industrial/800/400',
  themeColor: '#2563EB',     // Electric Blue - dtajer Primary
  secondaryColor: '#3B82F6', // Light Blue - dtajer Secondary
  textColor: '#0F172A',      // Charcoal Black - Headlines
  backgroundColor: '#FFFFFF', // White Background
  logoUrl: '',
  customCss: ''
};

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([DEFAULT_SLIDE]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'css'>('content');

  const slideRef = useRef<HTMLDivElement>(null);

  const updateSlide = (newData: Partial<SlideData>) => {
    setSlides(prev => prev.map((s, i) => i === activeIndex ? { ...s, ...newData } : s));
  };

  const addSlide = () => {
    const newSlide = { ...DEFAULT_SLIDE, id: Date.now().toString() };
    setSlides(prev => [...prev, newSlide]);
    setActiveIndex(slides.length);
  };

  const removeSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== index));
    setActiveIndex(Math.max(0, index - 1));
  };

  const handleAiGenerate = async (topic: string) => {
    setIsAiLoading(true);
    const result = await generateProfessionalCopy(topic);
    if (result) {
      updateSlide(result);
    }
    setIsAiLoading(false);
  };

  const handleExport = async () => {
    if (!slideRef.current || isExporting) return;

    setIsExporting(true);
    try {
      // Small delay to ensure any layout changes are settled
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await htmlToImage.toPng(slideRef.current, {
        quality: 1,
        pixelRatio: 3, // High resolution (3x) for professional quality
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `carousel-slide-${activeIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      alert('فشل تصدير الصورة. يرجى التأكد من أن جميع روابط الصور تسمح بـ CORS.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-['IBM_Plex_Sans_Arabic']">
      {/* Navigation Sidebar */}
      <nav className="nav-sidebar">
        <div className="nav-logo">
          <Layers size={24} />
        </div>
        <button
          onClick={() => setActiveTab('content')}
          className={`nav-button ${activeTab === 'content' ? 'active' : 'inactive'}`}
          title="المحتوى"
        >
          <TypeIcon size={24} />
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`nav-button ${activeTab === 'theme' ? 'active' : 'inactive'}`}
          title="المظهر"
        >
          <Palette size={24} />
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`nav-button ${activeTab === 'css' ? 'active' : 'inactive'}`}
          title="CSS متقدم"
        >
          <Code size={24} />
        </button>
        <div className="nav-footer">
          <button className="nav-button inactive">
            <Layout size={24} />
          </button>
        </div>
      </nav>

      {/* Editor Panel */}
      <aside className="editor-panel">
        <EditorPanel
          slide={slides[activeIndex]}
          onUpdate={updateSlide}
          onAiGenerate={handleAiGenerate}
          isAiLoading={isAiLoading}
          activeTab={activeTab}
        />
      </aside>

      {/* Main Workspace */}
      <div className="main-workspace">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-title">
            <h1>مصمم الكاروسيل</h1>
            <span className="header-badge">Beta</span>
          </div>

          <div className="header-actions">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="export-button"
            >
              {isExporting ? (
                <Loader2 size={18} className="loading-icon" />
              ) : (
                <Download size={18} />
              )}
              <span>{isExporting ? 'جاري التصدير...' : 'تصدير PNG'}</span>
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <main className="canvas-area pattern-gears">
          {isExporting && (
            <div className="export-overlay">
               <div className="export-loading-box">
                  <Loader2 size={40} className="text-red-600 loading-icon" />
                  <p className="export-loading-text">يتم الآن تحويل الشريحة إلى صورة عالية الجودة...</p>
               </div>
            </div>
          )}

          {/* Slide Navigator */}
          <div className="slide-navigator">
            <button
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className="nav-arrow-button"
            >
              <ChevronRight size={24} />
            </button>

            <div className="slide-indicators">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`slide-dot ${i === activeIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={activeIndex === slides.length - 1}
              className="nav-arrow-button"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="slide-container">
            <div ref={slideRef}>
              <SlidePreview slide={slides[activeIndex]} />
            </div>

            {/* Slide Actions Floating Overlay */}
            <div className="slide-actions">
              <button
                onClick={addSlide}
                className="slide-action-button add"
                title="إضافة شريحة"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => removeSlide(activeIndex)}
                className="slide-action-button remove"
                title="حذف الشريحة"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <div className="slide-counter">
            الشريحة {activeIndex + 1} من {slides.length}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
