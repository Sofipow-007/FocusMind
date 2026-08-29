#!/bin/bash

echo "=== FocusMind API Integration Test ==="
echo ""

# Test 1: Login and get token
echo "1. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@focusmind.com","password":"securepass123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✓ Login successful"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Test 2: Create a subject
echo "2. Creating a subject..."
CREATE_SUBJECT=$(curl -s -X POST http://localhost:3001/api/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre":"Matemáticas","favorita":true,"prioritaria":false}')

SUBJECT_ID=$(echo $CREATE_SUBJECT | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$SUBJECT_ID" ]; then
  echo "❌ Failed to create subject"
  echo "Response: $CREATE_SUBJECT"
  exit 1
fi

echo "✓ Subject created: ID=$SUBJECT_ID"
echo ""

# Test 3: Get all subjects
echo "3. Fetching all subjects..."
GET_SUBJECTS=$(curl -s -X GET http://localhost:3001/api/subjects \
  -H "Authorization: Bearer $TOKEN")

SUBJECT_COUNT=$(echo $GET_SUBJECTS | grep -o '"id"' | wc -l)

echo "✓ Found $SUBJECT_COUNT subject(s)"
echo ""

# Test 4: Create a study session
echo "4. Creating a study session..."
CREATE_SESSION=$(curl -s -X POST http://localhost:3001/api/study-sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"materiaId\":$SUBJECT_ID,\"fecha\":\"2026-08-29T10:00:00Z\",\"duracion\":60,\"descripcion\":\"Repaso de álgebra\"}")

SESSION_ID=$(echo $CREATE_SESSION | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to create study session"
  echo "Response: $CREATE_SESSION"
  exit 1
fi

echo "✓ Study session created: ID=$SESSION_ID"
echo ""

# Test 5: Create a note
echo "5. Creating a note..."
CREATE_NOTE=$(curl -s -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"materiaId\":$SUBJECT_ID,\"tipo\":\"definicion\",\"contenido\":\"Derivada: razón de cambio instantáneo\"}")

NOTE_ID=$(echo $CREATE_NOTE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$NOTE_ID" ]; then
  echo "❌ Failed to create note"
  echo "Response: $CREATE_NOTE"
  exit 1
fi

echo "✓ Note created: ID=$NOTE_ID"
echo ""

# Test 6: Get all notes filtered by type
echo "6. Fetching all 'definicion' notes..."
GET_NOTES=$(curl -s -X GET "http://localhost:3001/api/notes?tipo=definicion" \
  -H "Authorization: Bearer $TOKEN")

NOTES_COUNT=$(echo $GET_NOTES | grep -o '"id"' | wc -l)

echo "✓ Found $NOTES_COUNT note(s) of type 'definicion'"
echo ""

# Test 7: Update a subject
echo "7. Updating the subject..."
UPDATE_SUBJECT=$(curl -s -X PUT http://localhost:3001/api/subjects/$SUBJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"prioritaria":true}')

echo "✓ Subject updated"
echo ""

# Test 8: Test unauthorized access
echo "8. Testing unauthorized access..."
UNAUTHORIZED=$(curl -s -X GET http://localhost:3001/api/subjects \
  -H "Authorization: Bearer INVALID_TOKEN")

echo "Response (should indicate invalid token): $UNAUTHORIZED"
echo ""

echo "=== All tests completed successfully! ==="
