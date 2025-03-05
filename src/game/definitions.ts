import data from './game.json';

export interface Role {
    id: number;
    name: string;
    description: string;
    startLocationId: number;
}

export interface Location {
    id: number
    name: string;
    description: string;
    x: number;
    y: number;
}

export interface Map {
    locations: Location[];
    matrix: number[][];
}

export interface Event {
    id: number;
    name: string;
    description: string;
}

export interface ActionCondition {
    description: string;
}

export interface RoleLocationCondition extends ActionCondition {
    roleIds: number[]; // Empty if anyone can do the action
    locationId: number;
}

export interface EventCondition extends ActionCondition {
    eventId: number;
    occurred: boolean;
}

export interface ActionConditions {
    roleLocation?: RoleLocationCondition;
    events?: EventCondition[]; 
}

export interface BonusQuestion {
    question: string;
    multiplier: number;
}

export interface MultipleChoiceQuestionAnswer {
    answer: string;
    isCorrect: boolean;
}

export interface MultipleChoiceQuestion extends BonusQuestion {
    answers: MultipleChoiceQuestionAnswer[];
}

export interface OpenQuestion extends BonusQuestion {
    answer: string;
}

export interface Action {
    id: number;
    name: string;
    description: string;
    points: number;
    condition: RoleLocationCondition;  // For now
    bonusQuestion?: MultipleChoiceQuestion | OpenQuestion;
}

export interface Game {
    roles: Role[];
    map: Map;
    events: Event[];
    actions: Action[];
}

export const game: Game = data;
