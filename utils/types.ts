export interface Poll {
    questionId: number,
    category: number,
    content: string,
    choice1: string,
    choice2: string,
    language?: 'english' | 'french' | 'german' | 'spanish' | 'italian' | 'dutch' | 'portuguese' | 'french_canada',
    type: 'n' | 'w',
    date: string,
}

interface Choice {
    male: number;
    female: number;
    total: number;
}

interface Total {
    choice1: Choice;
    choice2: Choice;
    total: number;
}

interface PercentageChoice {
    male: number;
    female: number;
    total: number;
}

interface PercentageTotal {
    choice1: PercentageChoice;
    choice2: PercentageChoice;
}

export interface DetailedChart {
    total_predictions: Total;
    total_predictions_percentage: PercentageTotal;
    total_votes: Total;
    total_votes_percentage: PercentageTotal;
}