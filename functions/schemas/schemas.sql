CREATE TABLE HOST (
    ID BIGSERIAL,
    FirebaseUID VARCHAR(128),
    Name VARCHAR(64),
    Email VARCHAR(64),
    PRIMARY KEY (ID)
);

CREATE TABLE Participants (
    ID BIGSERIAL,
    FirebaseUID VARCHAR(128),
    Name VARCHAR(64),
    Email VARCHAR(64),
    PRIMARY KEY (ID)
);

CREATE TABLE Session (
    ID BIGSERIAL,
    UID VARCHAR(128) UNIQUE,
    Name VARCHAR(64),
    HostID BIGSERIAL,
    Datetime TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (ID),
    FOREIGN KEY (HostID) REFERENCES HOST(ID)
);

CREATE TABLE Groups (
    ID BIGSERIAL,
    SessionID BIGSERIAL,
    PRIMARY KEY (ID),
    FOREIGN KEY (SessionID) REFERENCES Session(ID)
);

CREATE TABLE Rankings (
    SessionID BIGSERIAL,
    SourceParticipantID BIGSERIAL,
    TargetParticipantID BIGSERIAL,
    RANK SMALLINT,
    PRIMARY KEY (SessionID, SourceParticipantID, TargetParticipantID),
    FOREIGN KEY (SourceParticipantID) REFERENCES Participants(ID),
    FOREIGN KEY (TargetParticipantID) REFERENCES Participants(ID)
);