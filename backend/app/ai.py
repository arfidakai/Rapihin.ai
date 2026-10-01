"""
AI Integration for Rapihin.ai
- Provides wrappers to call OpenAI GPT-4o models for text proofreading/rewrite.
- Reads API key from OPENAI_API_KEY environment variable.
"""
import os
from typing import Optional

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore

class AIUnavailable(Exception):
    pass

class AIService:
    def __init__(self, model: str = None):
        if OpenAI is None:
            raise AIUnavailable("OpenAI SDK not installed")
        if not os.getenv("OPENAI_API_KEY"):
            raise AIUnavailable("OPENAI_API_KEY is not set")

        self.client = OpenAI()
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def proofread(self, text: str, language: str = "id", style: Optional[str] = None) -> str:
        """
        Improve grammar, clarity, and academic tone while preserving meaning.
        Returns the improved text only.
        """
        prompt = (
            "Perbaiki tata bahasa, ejaan, dan kejelasan teks berikut dengan gaya akademik sederhana. "
            "Pertahankan makna asli dan gunakan bahasa yang natural. Balas hanya teks hasil perbaikan tanpa komentar tambahan.\n\n"
        )
        if style:
            prompt += f"Gaya tambahan: {style}.\n\n"

        messages = [
            {"role": "system", "content": "Kamu adalah editor akademik berbahasa Indonesia dan Inggris."},
            {"role": "user", "content": prompt + text},
        ]

        # Prefer chat.completions API for wide compatibility
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.2,
        )
        return resp.choices[0].message.content.strip() if resp.choices else text
