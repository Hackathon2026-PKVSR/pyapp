"""
API for hackthon_py project.

A FastAPI application that accepts text input and decomposes it into atomic facts.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import google.generativeai as genai
import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Google Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Hackthon API", description="API that processes text input and decomposes it into atomic facts")


class TextInput(BaseModel):
    """Model for text input."""
    text: str


class TextResponse(BaseModel):
    """Model for API response."""
    message: str
    received_text: str
    text_length: int
    atomic_facts: List[str]


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to Hackthon API! Visit /docs for API documentation."}


@app.post("/process-text", response_model=TextResponse)
async def process_text(input_data: TextInput):
    """
    Process text input and decompose it into atomic facts using Google Gemini AI.
    
    Args:
        input_data: TextInput object containing the text to process
    
    Returns:
        TextResponse with processing results including atomic facts
    """
    text = input_data.text
    
    # Check if API key is configured
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY environment variable is not set. Please configure your API key."
        )
    
    # Decompose text into atomic facts using Gemini
    try:
        # Auto-detect the first available generative model
        model_name = 'models/gemini-pro'
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                model_name = m.name
                break
        
        model = genai.GenerativeModel(model_name)
        
        prompt = f"""You are an expert data extraction assistant. Your task is to decompose a given paragraph into a list of "atomic facts."

An atomic fact is a statement that:
1. Contains exactly one discrete piece of information.
2. Is completely self-contained (replace all pronouns like "he," "she," "it," or "they" with the specific nouns they refer to).
3. Can be verified independently as true or false based solely on the text.

Constraints:
- Do not assume, extrapolate, or bring in outside knowledge. Extract only what is explicitly stated.
- Do not combine multiple independent clauses into one fact. Break them down.
- Maintain the original meaning without adding commentary.

Format your output as a clean, numbered Markdown list.

### Input Paragraph:
{text}

Atomic facts:"""
        
        response = model.generate_content(prompt)
        
        # Parse the response into a list of atomic facts
        atomic_facts = [
            fact.strip() 
            for fact in response.text.strip().split('\n') 
            if fact.strip()
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing text with AI: {str(e)}"
        )
    
    result = {
        "message": "Text decomposed into atomic facts successfully!",
        "received_text": text,
        "text_length": len(text),
        "atomic_facts": atomic_facts
    }
    
    return result


if __name__ == "__main__":
    # Run the API server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
