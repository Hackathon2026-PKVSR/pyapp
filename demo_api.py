"""
Demo script to test the Hackthon API.
"""

import requests
import json
import time

# Base URL of the API
BASE_URL = "http://localhost:8000"

print("=" * 60)
print("🚀 HACKTHON API DEMO")
print("=" * 60)

# Give the server a moment to fully start
time.sleep(1)

# Test 1: Root endpoint
print("\n📍 Test 1: GET / (Root Endpoint)")
print("-" * 60)
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Process simple text
print("\n📍 Test 2: POST /process-text (Simple Text)")
print("-" * 60)
try:
    payload = {"text": "Hello, this is a hackathon project!"}
    response = requests.post(f"{BASE_URL}/process-text", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Request: {json.dumps(payload, indent=2)}")
    result = response.json()
    print(f"Message: {result.get('message')}")
    print(f"Text Length: {result.get('text_length')}")
    print(f"Atomic Facts ({len(result.get('atomic_facts', []))}):")
    for i, fact in enumerate(result.get('atomic_facts', []), 1):
        print(f"  {i}. {fact}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: Process longer text
print("\n📍 Test 3: POST /process-text (Longer Text)")
print("-" * 60)
try:
    payload = {
        "text": "This is a demonstration of the FastAPI text processing endpoint. "
                "It accepts any text input and returns useful information about it."
    }
    response = requests.post(f"{BASE_URL}/process-text", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Request Text Length: {len(payload['text'])} characters")
    result = response.json()
    print(f"Message: {result.get('message')}")
    print(f"Atomic Facts ({len(result.get('atomic_facts', []))}):")
    for i, fact in enumerate(result.get('atomic_facts', []), 1):
        print(f"  {i}. {fact}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Process empty text
print("\n📍 Test 4: POST /process-text (Empty Text)")
print("-" * 60)
try:
    payload = {"text": ""}
    response = requests.post(f"{BASE_URL}/process-text", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test 5: Process text with special characters
print("\n📍 Test 5: POST /process-text (Special Characters)")
print("-" * 60)
try:
    payload = {"text": "Hello! 🎉 Testing with emojis & special chars: @#$%"}
    response = requests.post(f"{BASE_URL}/process-text", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Request: {json.dumps(payload, indent=2, ensure_ascii=False)}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 60)
print("✅ Demo Complete!")
print("=" * 60)
print(f"\n💡 Visit {BASE_URL}/docs for interactive API documentation")
