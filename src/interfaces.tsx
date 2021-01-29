export interface Participant {
  value: string;
  label: string;
}

export interface ISessionCard {
  TotalParticipants: string;
  RespondedParticipants: string;
  SessionName: string;
  SessionDatetime: number;
  SessionUID: string;
  SessionStatus?: string;
}
