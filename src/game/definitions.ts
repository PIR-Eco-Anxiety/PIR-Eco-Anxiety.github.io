import data from './data.json';

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface Location {
    id: number
    name: string;
    description: string;
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
    roleId: number;
    locationId: number;
}

export interface EventCondition extends ActionCondition {
    eventId: number;
    occurred: boolean;
}

export interface Action {
    id: number;
    name: string;
    description: string;
    points: number;
    conditions: ActionCondition[];
}

export interface Game {
    roles: Role[];
    locations: Location[];
    events: Event[];
    actions: Action[];
}

export const game: Game = data;
