import { ParticipantDB, RankingsDB } from './interfaces/db';

enum NodeStatus {
  UNMATCHED,
  MATCHED,
}

class Node {
  data: ParticipantDB;
  status: NodeStatus;
  constructor(data: ParticipantDB) {
    this.data = data;
    this.status = NodeStatus.UNMATCHED;
  }
}

class Edge {
  weight: number;
  node1: Node;
  node2: Node;

  constructor(node1: Node, node2: Node, weight: number) {
    this.node1 = node1;
    this.node2 = node2;
    this.weight = weight;
  }
}

export class Solver {
  nodes: Node[];
  edges: Edge[];

  constructor(rawRankings: RankingsDB[], participants: ParticipantDB[]) {
    this.nodes = participants.map((participant) => new Node(participant));
    this.edges = [];

    // Following lines populate the edges array by finding all combinations
    // of participants, and find the appropriate ranking of those participants.
    for (let i = 0; i < this.nodes.length - 1; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const participant1 = this.nodes[i];
        const participant2 = this.nodes[j];

        const rank1 = Solver.getParticipantRanking(
          rawRankings,
          participant1.data.id,
          participant2.data.id
        );
        const rank2 = Solver.getParticipantRanking(
          rawRankings,
          participant2.data.id,
          participant1.data.id
        );

        this.edges.push(
          new Edge(participant1, participant2, (rank1 + rank2) / 2)
        );
      }
    }

    this.edges.sort((a, b) => a.weight - b.weight);
    this.edges.reverse();

    console.log(this.edges);
  }

  /**
   * Utility function for find the ranking of the specified participants. If
   * the participants are not in the array, a default value of 1 is returned.
   * @param {RankingsDB[]} rawRankings
   * @param {number} sourceParticipantID
   * @param {number} targetParticipantID
   * @return {number} The weight assigned to those participants
   */
  static getParticipantRanking(
    rawRankings: RankingsDB[],
    sourceParticipantID: number,
    targetParticipantID: number
  ) {
    for (const ranking of rawRankings) {
      if (
        ranking.sourceparticipantid === sourceParticipantID &&
        ranking.targetparticipantid === targetParticipantID
      ) {
        return ranking.rank;
      }
    }

    // Default value
    return 1;
  }
}
