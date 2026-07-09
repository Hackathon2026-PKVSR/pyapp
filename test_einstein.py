import requests
import json

BASE_URL = "http://localhost:8000"

text = "Einstein won the Nobel Prize in Physics in 1921 for his theory of relativity"

print("Testing API with Einstein text...")
print("=" * 70)

try:
    payload = {"text": text}
    response = requests.post(f"{BASE_URL}/process-text", json=payload)
    
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Message: {result['message']}\n")
        print(f"📝 Original Text:\n{result['received_text']}\n")
        print(f"📊 Text Length: {result['text_length']} characters\n")
        print(f"🔍 Atomic Facts ({len(result['atomic_facts'])}):")
        print("-" * 70)
        for i, fact in enumerate(result['atomic_facts'], 1):
            print(f"{i}. {fact}")
    else:
        print(f"❌ Error: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("=" * 70)
