CREATE TABLE Hosts (
    ID SERIAL,
    FirebaseUID VARCHAR(128) UNIQUE NOT NULL,
    Name VARCHAR(64) NOT NULL,
    Email VARCHAR(64) UNIQUE NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Participants (
    ID SERIAL,
    FirebaseUID VARCHAR(128) UNIQUE NOT NULL,
    Name VARCHAR(64) NOT NULL,
    Email VARCHAR(64) UNIQUE NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Sessions (
    ID SERIAL,
    UID VARCHAR(128) UNIQUE NOT NULL,
    Name VARCHAR(64) NOT NULL,
    HostID INT NOT NULL,
    GroupSize INT NOT NULL,
    Datetime TIMESTAMP NOT NULL DEFAULT NOW(),
    Status VARCHAR(20) NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (HostID) REFERENCES HOSTS(ID)
);

CREATE TABLE Groups (
    ID SERIAL,
    SessionID INT NOT NULL,
    PRIMARY KEY (ID),
    FOREIGN KEY (SessionID) REFERENCES Sessions(ID)
);

CREATE TABLE ParticipantGroups (
    SessionID INT,
    ParticipantID INT,
    GroupID INT,
    PRIMARY KEY (SessionID, ParticipantID, GroupID),
    FOREIGN KEY (SessionID) REFERENCES Sessions(ID),
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ID),
    FOREIGN KEY (GroupID) REFERENCES Groups(ID) ON DELETE CASCADE
);

CREATE TABLE ParticipantSessions (
    ParticipantID INT,
    SessionID INT,
    PRIMARY KEY (ParticipantID, SessionID),
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ID),
    FOREIGN KEY (SessionID) REFERENCES Sessions(ID)
);

CREATE TABLE Rankings (
    SessionID INT,
    SourceParticipantID INT,
    TargetParticipantID INT,
    Rank SMALLINT NOT NULL,
    PRIMARY KEY (SessionID, SourceParticipantID, TargetParticipantID),
    FOREIGN KEY (SourceParticipantID) REFERENCES Participants(ID),
    FOREIGN KEY (TargetParticipantID) REFERENCES Participants(ID)
);
