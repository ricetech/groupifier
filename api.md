- All data is transmitted in JSON for responses and POSTS. GET uses URL parameters.
- All requests should be authenticated using a Firebase token. The token should be added in the "Authorization" header of requests.

## Session Endpoint (for the host)

- createSession (POST): 
  - **Request**
    - HostName: String
    - SessionName: String
    - Participants: List of Objects
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
      - SessionDatetime: Long (Unix Time)
      - SessionUID: String
      - SessionStatus: String
  
- solveSession: (POST)
  - **Request**:
    - SessionsUID: String
  - **Response**:
    - SessionStatus: String
  
- getSession: (GET)
  - **Request**:
    - SessionUID: String
  - **Response**:
    - SessionName: String
    - SessionStatus: String
    - Participants: List of Objects
      - ParticipantName: String
    - ParticipantGroups: List of Arrays (Can be NULL)
      - List of Objects:
        - ParticipantName: String
  
## Participant endpoints

- getSessionParticipants: (GET)
  - **Request**:
    - SessionUID: String
  - **Response**:
    - Participants: Array of Objects
      - ParticipantName: String
      - ParticipantID: Number

- updatePreferences (POST):
  - **Request**:
    - DreamParticipants: Array of Numbers
    - NightmareParticipants: Array of Numbers
  - **Response**:
  
