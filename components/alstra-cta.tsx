"use client";

import { useEffect } from "react";

interface AlstraCtaProps {
    cta: any;
    apiUrl: string;
}

export function AlstraCta({ cta, apiUrl }: AlstraCtaProps) {
    const handleClick = () => {
        if (!cta.template_id || !cta.val_hash) return;

        // Fire and forget tracking
        fetch(`${apiUrl}/api/public/cta/click`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                templateId: cta.template_id,
                variationHash: cta.val_hash,
            }),
            keepalive: true, // Important: Ensures request completes after navigation
        }).catch((err) => console.error("Tracking error:", err));
    };

    return (
        <a
            href={cta.url}
            onClick={handleClick}
            className="inline-block px-8 py-4 text-lg font-semibold rounded-full hover:opacity-90 transition-opacity"
            style={{
                backgroundColor: cta.btn_color || "#000",
                color: cta.btn_text_color || "#fff",
            }}
        >
            {cta.label}
        </a>
    );
}
