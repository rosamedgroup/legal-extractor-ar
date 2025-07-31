// api/gemini-ar.js

export default async function handler(request, response) {
  // يتم السماح بطلبات POST فقط لهذه الدالة
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // جلب مفتاح الواجهة البرمجية من متغيرات البيئة الآمنة في Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("مفتاح الواجهة البرمجية غير مُعد.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // إعادة إرسال الطلب القادم من تطبيق الويب إلى واجهة Gemini API
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body), // تمرير المحتوى القادم من طلب العميل
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("Google API Error:", errorBody);
      return response.status(geminiResponse.status).json({ message: 'خطأ من واجهة Gemini API' });
    }

    const data = await geminiResponse.json();
    
    // إرسال الاستجابة من Gemini مرة أخرى إلى تطبيق الويب الخاص بنا
    return response.status(200).json(data);

  } catch (error) {
    console.error("Serverless function error:", error);
    return response.status(500).json({ message: 'خطأ داخلي في الخادم' });
  }
}
