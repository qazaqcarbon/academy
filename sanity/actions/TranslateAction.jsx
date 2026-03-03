"use client";
import React, { useState } from 'react';
import { useDocumentOperation } from 'sanity';

export function TranslateAction(props) {
    const { id, type, published, draft, onComplete } = props;
    const [isTranslating, setIsTranslating] = useState(false);
    const { patch, publish } = useDocumentOperation(id, type);

    if (type !== 'article') return null;

    const onAction = async () => {
        setIsTranslating(true);
        try {
            // 1. Send the document ID to the API route for translation
            // Correct logic would be to hit /api/translate which we just created
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type })
            });
            const data = await res.json();

            if (res.ok) {
                alert('Translation process started! Check the Studio for updates.');
            } else {
                alert(`Error: ${data.error || 'Check server logs'}`);
            }
        } catch (err) {
            console.error('Translation error:', err);
            alert('Error calling translate API.');
        } finally {
            setIsTranslating(false);
            onComplete();
        }
    }

    return {
        label: isTranslating ? 'Translating...' : 'Translate to English (AI)',
        onHandle: onAction,
        disabled: isTranslating || !published
    };
}
