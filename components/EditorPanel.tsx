import React, { useState } from 'react';
import { Sparkles, Save, ChevronDown, ChevronUp, RefreshCw, Palette, Code, Trash2, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { SlideData } from '../types';

interface Props {
  slide: SlideData;
  onUpdate: (data: Partial<SlideData>) => void;
  onAiGenerate: (topic: string) => void;
  isAiLoading: boolean;
  activeTab: 'content' | 'theme' | 'css';
}

// Modern Theme Presets - Al-Tajer Digital Inspired
const THEMES = [
  { id: 'electric', name: 'أزرق كهربائي', colors: { theme: '#2563EB', secondary: '#3B82F6', text: '#0F172A', bg: '#FFFFFF' } },
  { id: 'mint', name: 'نعناع عصري', colors: { theme: '#059669', secondary: '#10B981', text: '#0F172A', bg: '#FFFFFF' } },
  { id: 'purple', name: 'بنفسجي عميق', colors: { theme: '#7C3AED', secondary: '#8B5CF6', text: '#0F172A', bg: '#FFFFFF' } },
  { id: 'orange', name: 'برتقالي حيوي', colors: { theme: '#EA580C', secondary: '#F97316', text: '#0F172A', bg: '#FFFFFF' } },
  { id: 'rose', name: 'وردي ناعم', colors: { theme: '#E11D48', secondary: '#FB7185', text: '#0F172A', bg: '#FFFFFF' } },
  { id: 'cyan', name: 'سيان مبتكر', colors: { theme: '#0891B2', secondary: '#06B6D4', text: '#0F172A', bg: '#FFFFFF' } },
  { id: 'dark', name: 'الوضع الليلي', colors: { theme: '#3B82F6', secondary: '#8B5CF6', text: '#F1F5F9', bg: '#0F172A' } },
  { id: 'gold', name: 'ذهبي فاخر', colors: { theme: '#CA8A04', secondary: '#EAB308', text: '#0F172A', bg: '#FFFFFF' } },
];

const EditorPanel: React.FC<Props> = ({ slide, onUpdate, onAiGenerate, isAiLoading, activeTab }) => {
  const [aiTopic, setAiTopic] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('main');

  const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
    <div className="form-section">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="form-section-header"
      >
        <span className="form-section-title">{title}</span>
        {expandedSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {expandedSection === id && <div className="form-section-content">{children}</div>}
    </div>
  );

  const applyTheme = (theme: typeof THEMES[0]) => {
    onUpdate({
      themeColor: theme.colors.theme,
      secondaryColor: theme.colors.secondary,
      textColor: theme.colors.text,
      backgroundColor: theme.colors.bg
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (activeTab === 'css') {
    return (
      <div className="css-panel">
        <div className="css-panel-header">
          <h3 className="css-panel-title" dir="rtl">
            <Code size={20} />
            محرر CSS المتقدم
          </h3>
        </div>

        <div className="css-panel-content">
          <div className="css-info-box" dir="ltr">
             <span className="css-info-title">Available Classes:</span>
             <div className="css-info-content">
               .slide-root, .slide-title, .slide-subtitle, .slide-percentage-main, .slide-stat-value, .slide-comparison-badge, .slide-description, .slide-footer-img, .slide-logo-container
             </div>
          </div>

          <textarea
            className="css-editor"
            placeholder="/* ...هنا لتخصيص التصميم CSS اكتب كود */&#10;.slide-title {&#10;  color: #ff0000;&#10;}"
            value={slide.customCss || ''}
            onChange={(e) => onUpdate({ customCss: e.target.value })}
            dir="ltr"
            spellCheck={false}
          />

          <button
            onClick={() => onUpdate({ customCss: '' })}
            className="css-reset-button"
          >
            إعادة تعيين CSS
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'theme') {
    return (
      <div className="theme-panel">
        <div className="theme-panel-header">
          <h3 className="theme-panel-title">
            <Palette size={20} className="text-blue-600" />
            التنسيق والمظهر
          </h3>
        </div>

        <div className="theme-panel-content">

          {/* Ready Themes Section */}
          <div className="theme-section">
            <h4 className="theme-section-title">الثيمات الجاهزة</h4>
            <div className="theme-grid">
              {THEMES.map(theme => {
                const isActive = slide.themeColor === theme.colors.theme && slide.secondaryColor === theme.colors.secondary;
                return (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme)}
                    className={`theme-card ${isActive ? 'active' : ''}`}
                  >
                    <div className="theme-card-header">
                      <span className="theme-card-name">{theme.name}</span>
                      <div className="theme-card-colors">
                        <div className="theme-color-dot" style={{ backgroundColor: theme.colors.theme }}></div>
                        <div className="theme-color-dot" style={{ backgroundColor: theme.colors.secondary }}></div>
                      </div>
                    </div>
                    {/* Progress Bar Visual */}
                    <div className="theme-preview-bar">
                      <div className="theme-preview-main" style={{ backgroundColor: isActive ? theme.colors.theme : '#CBD5E1' }}></div>
                      <div className="theme-preview-secondary" style={{ backgroundColor: isActive ? theme.colors.secondary : '#E2E8F0' }}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="theme-divider"></div>

          {/* Logo Upload Section */}
          <div className="logo-section">
            <label className="logo-label">شعار المؤسسة (Logo)</label>
            <div className="logo-upload-container">
              <div className="logo-upload-box">
                {slide.logoUrl ? (
                  <img src={slide.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="logo-upload-input"
                  title="اضغط لرفع الشعار"
                />
              </div>
              <div className="logo-input-container">
                <div className="logo-input-wrapper">
                  <input
                    type="text"
                    value={slide.logoUrl || ''}
                    onChange={(e) => onUpdate({ logoUrl: e.target.value })}
                    placeholder="أو ضع رابط الشعار هنا..."
                    className="logo-url-input"
                    dir="ltr"
                  />
                  {slide.logoUrl && (
                    <button
                      onClick={() => onUpdate({ logoUrl: '' })}
                      className="logo-delete-button"
                      title="حذف الشعار"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="logo-hint">يدعم JPG, PNG (يفضل خلفية شفافة)</p>
              </div>
            </div>

            {/* Preset Logos Section */}
            <div className="logo-preset-section">
              <label className="logo-label">أو اختر شعاراً جاهزاً</label>
              <div className="logo-preset-grid">
                {[
                  { id: 1, path: '/logos/logo-1.png', name: 'شعار 1' },
                  { id: 2, path: '/logos/logo-2.png', name: 'شعار 2' },
                  { id: 3, path: '/logos/logo-3.png', name: 'شعار 3' },
                  { id: 4, path: '/logos/logo-4.png', name: 'شعار 4' },
                ].map(logo => {
                  const isActive = slide.logoUrl === logo.path;
                  return (
                    <button
                      key={logo.id}
                      onClick={() => onUpdate({ logoUrl: logo.path })}
                      className={`logo-preset-item ${isActive ? 'active' : ''}`}
                      title={logo.name}
                    >
                      <img src={logo.path} alt={logo.name} className="logo-preset-img" />
                      {isActive && <div className="logo-preset-check"><Check size={12} strokeWidth={3} /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="theme-divider"></div>

          {/* Custom Colors Section */}
          <div className="colors-section">
            <h4 className="theme-section-title">تخصيص الألوان</h4>
            <div className="colors-grid">
              <div className="color-field">
                <label className="color-label">الأساسي</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={slide.themeColor}
                    onChange={(e) => onUpdate({ themeColor: e.target.value })}
                    className="color-picker"
                  />
                  <span className="color-value" dir="ltr">{slide.themeColor}</span>
                </div>
              </div>

              <div className="color-field">
                <label className="color-label">الثانوي</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={slide.secondaryColor}
                    onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                    className="color-picker"
                  />
                  <span className="color-value" dir="ltr">{slide.secondaryColor}</span>
                </div>
              </div>

              <div className="color-field">
                <label className="color-label">النصوص</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={slide.textColor}
                    onChange={(e) => onUpdate({ textColor: e.target.value })}
                    className="color-picker"
                  />
                  <span className="color-value" dir="ltr">{slide.textColor}</span>
                </div>
              </div>

              <div className="color-field">
                <label className="color-label">الخلفية</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={slide.backgroundColor}
                    onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                    className="color-picker"
                  />
                  <span className="color-value" dir="ltr">{slide.backgroundColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-image-section">
            <label className="logo-label">صورة الخلفية / التوضيحية</label>
            <div className="footer-image-input-wrapper">
              <input
                type="text"
                value={slide.footerImage}
                onChange={(e) => onUpdate({ footerImage: e.target.value })}
                placeholder="رابط الصورة..."
                className="footer-image-input"
              />
              <button
                onClick={() => onUpdate({ footerImage: `https://picsum.photos/seed/${Math.random()}/800/400` })}
                className="footer-image-refresh"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* AI Assistant Section */}
      <div className="ai-assistant-section">
        <div className="ai-assistant-header">
          <Sparkles size={20} className="text-blue-600" />
          <h3 className="ai-assistant-title">مساعد المحتوى الذكي</h3>
        </div>
        <div className="ai-input-container">
          <textarea
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="اكتب موضوعك هنا ليقوم الذكاء الاصطناعي بصياغته..."
            className="ai-textarea"
          />
          <button
            onClick={() => onAiGenerate(aiTopic)}
            disabled={isAiLoading || !aiTopic}
            className="ai-generate-button"
          >
            {isAiLoading ? <RefreshCw size={14} className="loading-icon" /> : <Sparkles size={14} />}
            صياغة احترافية
          </button>
        </div>
      </div>
      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto">
        <Section id="main" title="العناوين الأساسية">
          <div className="space-y-4">
            <div className="form-field">
              <label className="form-label">العنوان الرئيسي</label>
              <input
                value={slide.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">العنوان الفرعي</label>
              <textarea
                value={slide.subtitle}
                onChange={(e) => onUpdate({ subtitle: e.target.value })}
                className="form-textarea"
              />
            </div>
          </div>
        </Section>

        <Section id="data" title="البيانات والأرقام">
          <div className="space-y-4">
            <div className="form-field">
              <label className="form-label">النسبة المئوية</label>
              <input
                value={slide.percentage}
                onChange={(e) => onUpdate({ percentage: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">القيمة الحالية</label>
                <input
                  value={slide.val1}
                  onChange={(e) => onUpdate({ val1: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label className="form-label">الوصف الزمني</label>
                <input
                  value={slide.label1}
                  onChange={(e) => onUpdate({ label1: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">القيمة المقارنة</label>
                <input
                  value={slide.val2}
                  onChange={(e) => onUpdate({ val2: e.target.value })}
                  className="form-input form-input-secondary"
                />
              </div>
              <div className="form-field">
                <label className="form-label">الوصف المقارن</label>
                <input
                  value={slide.label2}
                  onChange={(e) => onUpdate({ label2: e.target.value })}
                  className="form-input form-input-secondary"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section id="details" title="التفاصيل والوصف">
          <div className="form-field">
            <label className="form-label">الوصف التفصيلي</label>
            <textarea
              value={slide.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="form-textarea"
            />
          </div>
        </Section>
      </div>

      {/* Footer Branding */}
      <div className="auto-save-footer">
        <Save size={14} />
        يتم الحفظ تلقائياً في المتصفح
      </div>
    </div>
  );
};

export default EditorPanel;
