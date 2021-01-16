export interface CreateSessionRequest {
  HostName: string;
  SessionName: string;
  Participants: Array<{ ParticipantName: string; ParticipantEmail: string }>;
}

export interface GetSessionRequest {
  SessionUID: string;
}

export interface GetSessionParticipantRequest {
  SessionUID: string;
}

export interface UpdateParticipantPreferencesRequest {
  SessionUID: string;
  DreamParticipants: number[];
  NightmareParticipants: number[];
}
