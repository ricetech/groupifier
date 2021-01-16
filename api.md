- All data is transmitted in JSON for responses and POSTS. GET uses URL parameters.
- All requests should be authenticated using a Firebase token. The token should be added in the "Authentication" header of requests.

## Session Endpoint (for the host)

- createSession (POST): 
  - **Request**
    - HostName: String
    - HostEmail: String
    - SessionName: String
    - List of Objects:
        - ParticipantName: String
        - ParticipantEmail: String
  - **Response**:
    - Datetime: Long (Unix Time)
    - SessionName: String
    - SessionUID: String
    
- getAllSessions (GET):
  - **Request**:
  - **Response**:
    - List of Objects:
      - TotalParticipants: Number
      - RespondedParticipants: Number
      - SessionName: String
      - Datetime: Long (Unix Time)
      - SessionUID: String
      - Status: String
  
- solveSession: (POST)
  - **Request**:
    - SessionsUID: String
  - **Response**:
    - Status: String
  
- getSession: (GET)
  - **Request**:
    - SessionUID: String
  - **Response**:
    - Status: String
    - List of Objects:
      - ParticipantName: String
    - List of Arrays: (Can be NULL)
      - List of Objects:
        - ParticipantName: String
  
## Participant endpoints

- getSessionParticipants: (GET)
  - **Request**:
    - SessionUID: String
  - **Response**:
    - Array of Objects:
      - ParticipantName: String
      - ParticipantID: Number

- updatePreferences (POST):
  - **Request**:
    - dreamParticipants: Array of Numbers
    - nightmareParticipants: Array of Numbers
  - **Response**:
  
