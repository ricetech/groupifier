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
  groupSize: number;

  constructor(
    rawRankings: RankingsDB[],
    participants: ParticipantDB[],
    groupSize: number
  ) {
    this.nodes = participants.map((participant) => new Node(participant));
    this.edges = [];
    this.groupSize = groupSize;

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
  }

  /**
   * Find groups given the rating of each participant. This function must only
   * be called once.
   */
  solve() {
    const groups: Node[][] = [];

    this.edges.sort((a, b) => a.weight - b.weight);
    this.edges.reverse();

    // Pick each edges, starting from the largest (sorted above)
    for (const edge of this.edges) {
      // Only continue this loop if both nodes are not matched.
      if (
        edge.node1.status === NodeStatus.MATCHED ||
        edge.node2.status === NodeStatus.MATCHED
      ) {
        continue;
      }

      const newGroup = [];

      newGroup.push(edge.node1);
      newGroup.push(edge.node2);
      edge.node1.status = NodeStatus.MATCHED;
      edge.node2.status = NodeStatus.MATCHED;

      while (newGroup.length !== this.groupSize) {
        const newEdge = Solver.getLargestAvailableEdgeOfGroup(
          newGroup,
          this.edges
        );

        // If we could not find a newEdge, break
        if (newEdge === null) {
          break;
        }

        // Select the unmatched node (the node not already in our group)
        const newNode =
          newEdge.node1.status === NodeStatus.UNMATCHED
            ? newEdge.node1
            : newEdge.node2;

        newNode.status = NodeStatus.MATCHED;

        newGroup.push(newNode);
      }

      groups.push(newGroup);
    }

    // Check if we have remaining nodes, and just form a group with them.
    const remainingNodes = this.nodes.filter(
      (node) => node.status === NodeStatus.UNMATCHED
    );
    if (remainingNodes.length > 0) {
      groups.push(remainingNodes);
    }

    // Return the formed groups, stripping out the Node class
    return groups.map((group) => group.map((node) => node.data));
  }

  /**
   * Returns the largest edge that is connected to the group but contains one
   * node that is unmatched
   * @param {Node[]} group
   * @param {Edge[]} edges
   * @return {Edge | null} The edge satisfying the above conditions.
   */
  static getLargestAvailableEdgeOfGroup(group: Node[], edges: Edge[]) {
    let largestEdge: Edge | null = null;
    for (const node of group) {
      const nodeEdges = Solver.getEdgesOfNode(node, edges);
      for (const edge of nodeEdges) {
        if (
          (largestEdge === null || edge.weight > largestEdge.weight) &&
          (edge.node1.status === NodeStatus.UNMATCHED ||
            edge.node2.status === NodeStatus.UNMATCHED)
        ) {
          largestEdge = edge;
        }
      }
    }

    return largestEdge;
  }

  static getEdgesOfNode(node: Node, edges: Edge[]) {
    return edges.filter((edge) => edge.node1 === node || edge.node2 === node);
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
