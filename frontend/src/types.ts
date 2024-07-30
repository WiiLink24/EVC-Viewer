export interface Poll {
    question_id: Number,
    content: String,
    choice1: String,
    choice2: String,
    language: 'english' | 'french' | 'german' | 'spanish' | 'italian' | 'dutch' | 'portuguese' | 'french_canada',
    type: 'n' | 'w',
    date: Date,
}
