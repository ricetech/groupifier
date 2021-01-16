export interface CreateSessionRequest {
    HostName: string,
    SessionName: string,
    Participants: Array<{ParticipantName: string, ParticipantEmail: string}>
}
