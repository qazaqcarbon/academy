import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
});

export async function POST(req) {
    try {
        const { id, type } = await req.json();
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;

        if (!id || type !== 'article') return NextResponse.json({ error: 'Invalid document' }, { status: 400 });
        if (!apiKey) return NextResponse.json({ error: 'GOOGLE_GENAI_API_KEY is missing' }, { status: 500 });

        const doc = await client.getDocument(id);
        if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

        console.log(`Starting AI translation for: ${doc.title}`);

        // Helper for calling Gemini
        const translate = async (text) => {
            if (!text) return '';
            const prompt = `Translate this text from Russian to English. Maintain professional tone. Return ONLY the translation.\n\nText: ${text}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        };

        // 1. Translate basic fields
        const title_en = await translate(doc.title);
        const subtitle_en = await translate(doc.subtitle);
        const badgeText_en = await translate(doc.badgeText);

        // 2. Translate Portable Text (simplified for blocks)
        const content_en = await Promise.all((doc.content || []).map(async (block) => {
            if (block._type === 'block') {
                const translatedText = await translate(block.children.map(c => c.text).join(' '));
                return {
                    ...block,
                    children: [{ _key: 'trans', _type: 'span', text: translatedText }]
                };
            }
            if (block._type === 'infoBox') {
                return {
                    ...block,
                    title_en: await translate(block.title),
                    content_en: await translate(block.content)
                };
            }
            // Add more block translation logic as needed for orgCard, timeline, etc.
            return block;
        }));

        // 3. Patch the document
        await client.patch(id).set({
            title_en,
            subtitle_en,
            badgeText_en,
            content_en
        }).commit();

        return NextResponse.json({ success: true, translatedTitle: title_en });

    } catch (err) {
        console.error('Translation process failed:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
