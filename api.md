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
    - SessionUID: String
  - **Response**:
    - SessionStatus: String
- getSession: (GET)
  - **Request**:
    - SessionUID: String
  - **Response**:
    - TotalParticipants: Number
    - RespondedParticipants: Number
    - SessionName: String
    - SessionDatetime: Long (Unix Time)
    - SessionUID: String
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
- setParticipantFirebaseUID: (POST) (The Authorization header contains enough information to do everything)

  - **Request**:
  - **Response**:

- updateParticipantPreferences (POST):
  - **Request**:
    - SessionUID: String
    - DreamParticipants: Array of Strings\*\*\*
    - NightmareParticipants: Array of Strings\*\*\*
  - **Response**:

\*\*\*: For updateParticipantPreferences, the strings are a number. The thing is, the number is so big that Javascript rounds it. Just send the number as a string, seems to work fine.
