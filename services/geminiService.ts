
import { GoogleGenAI } from "@google/genai";

// Safe retrieval of API Key
const getApiKey = () => {
  try {
    return process.env.API_KEY || process.env.GEMINI_API_KEY || '';
  } catch {
    return '';
  }
};

/**
 * Generates a high-quality mock response for when the API is not available
 */
const generateMockResponse = (topic: string) => {
  const categories = ['نمو استراتيجي', 'تحليل السوق', 'ابتكار تقني', 'كفاءة تشغيلية'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    title: topic.length > 25 ? topic.substring(0, 25) + '...' : topic,
    subtitle: `${category}: نظرة تحليلية حول ${topic} وأهم التأثيرات المتوقعة`,
    percentage: `%${Math.floor(Math.random() * 30) + 15}.4`,
    comparisonLabel: 'مقابل',
    val1: `${(Math.random() * 5 + 2).toFixed(3)} مليار دولار`,
    label1: 'القيمة التقديرية (2024)',
    val2: `${(Math.random() * 4 + 1).toFixed(3)} مليار دولار`,
    label2: 'لعام 2023',
    description: `كشف تقرير حديث من منصة التاجر أن ${topic} يشهد تحولاً جذرياً مدفوعاً بالطلب المتزايد على الحلول الذكية، مما يعزز مكانة الاقتصاد الرقمي.`
  };
};

export const generateProfessionalCopy = async (topic: string) => {
  const apiKey = getApiKey();

  // If no API key is set, go straight to mock to "work without API"
  if (!apiKey || apiKey.trim() === '') {
    console.log("Working in Local/Global mode without API key. Using mock generator.");
    return generateMockResponse(topic);
  }

  try {
    // Lazy initialize to prevent module-level crashes on Vercel
    const genAI = new GoogleGenAI({ apiKey });
    const model = (genAI.models as any).generateContent ? genAI.models : null;
    
    if (!model) {
       console.warn("Gemini Client initialization failed partially. Using fallback.");
       return generateMockResponse(topic);
    }

    const prompt = `حول هذا الموضوع إلى محتوى احترافي لإنفوجرافيك باللغة العربية: "${topic}". 
    أحتاج إلى JSON بالهيكل التالي:
    {
      "title": "عنوان عريض",
      "subtitle": "عنوان فرعي",
      "percentage": "نسبة مئوية مع رمز %",
      "comparisonLabel": "تسمية للمقارنة (مثلاً: مقابل)",
      "val1": "القيمة الأولى",
      "val2": "القيمة الثانية",
      "label1": "تسمية القيمة الأولى",
      "label2": "تسمية القيمة الثانية",
      "description": "وصف مفصل"
    }`;

    const response = await (genAI.models as any).generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response && response.text) {
      try {
        return JSON.parse(response.text.trim());
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    }
    
    return generateMockResponse(topic);
  } catch (error) {
    console.error("Gemini Global Error:", error);
    // Always provide a fallback so the app works even if environment setup is wrong
    return generateMockResponse(topic);
  }
};
