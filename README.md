# hackthon_py

A Python script project for the Kanini Hackathon.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone or navigate to this repository
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your Google Gemini API key:
   - Get your API key from: https://aistudio.google.com/apikey
   - Create a `.env` file in the project root (copy from `.env.example`):
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

### Usage

Run the main script:
```bash
python main.py
```

The API will start on http://localhost:8000

**Available Endpoints:**
- `GET /` - Welcome message
- `POST /process-text` - Decompose text into atomic facts using Google Gemini AI
  - Request body: `{"text": "your text here"}`
  - Response includes: atomic facts, text length, and processing message

**Interactive API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Testing the API:**
Run the demo script in a separate terminal:
```bash
python demo_api.py
```

## Project Structure

```
.
├── main.py              # Main entry point of the application
├── requirements.txt     # Project dependencies
├── README.md           # This file
└── .vscode/            # VS Code settings
    └── settings.json
```

## Development

Add your Python code in `main.py` or create additional modules as needed.

## License

MIT License
