export interface results {
  votes: {
    choice1: choice
    choice2: choice
  };
  predictions: {
    choice1: choice
    choice2: choice
  };
  total: {
    votes: {
      choice1: choice
      choice2: choice
      all: number;
    };
    predictions: {
      choice1: choice
      choice2: choice
      all: number;
    };
  };
}

export interface choice {
  m: number,
  f: number,
  all: number,
}

function calcTotal(votes: number[][]): { votes: { choice1: number, choice2: number, all: number }, predictions: { choice1: number, choice2: number, all: number } } {
    return {
      votes: {
        choice1: votes[0][0] + votes[0][1],
        choice2: votes[0][2] + votes[0][3],
        all: votes[0][0] + votes[0][1] + votes[0][2] + votes[0][3],
      },
      predictions: {
        choice1: votes[1][0] + votes[1][1],
        choice2: votes[1][2] + votes[1][3],
        all: votes[1][0] + votes[1][1] + votes[1][2] + votes[1][3],
      }
    };
}

export function usePercentage(votes: number[][]): results {
    const total = calcTotal(votes)
    return {
      votes: {
        choice1: {
          m: (votes[0][0] / total.votes.choice1) * 100,
          f: (votes[0][1] / total.votes.choice1) * 100,
          all: (votes[0][0] + votes[0][1] / total.votes.all) * 100,
        },
        choice2: {
          m: (votes[0][2] / total.votes.choice2) * 100,
          f: (votes[0][3] / total.votes.choice2) * 100,
          all: (votes[0][2] + votes[0][3] / total.votes.all) * 100,
        },
      },
      predictions: {
        choice1: {
          m: (votes[1][0] / total.votes.choice1) * 100,
          f: (votes[1][1] / total.votes.choice1) * 100,
          all: (votes[1][0] + votes[1][1] / total.votes.all) * 100,
        },
        choice2: {
          m: (votes[1][2] / total.votes.choice2) * 100,
          f: (votes[1][3] / total.votes.choice2) * 100,
          all: (votes[1][2] + votes[1][3] / total.votes.all) * 100,
        },
      },
      total: {
        votes: {
          choice1: {
            m: votes[0][0],
            f: votes[0][1],
            all: total.votes.choice1,
          },
          choice2: {
            m: votes[0][2],
            f: votes[0][3],
            all: total.votes.choice2,
          },
          all: total.votes.all,
        },
        predictions: {
          choice1: {
            m: votes[1][0],
            f: votes[1][1],
            all: total.predictions.choice1,
          },
          choice2: {
            m: votes[1][2],
            f: votes[1][3],
            all: total.predictions.choice2,
          },
          all: total.predictions.all,
        },
      },
    };
}