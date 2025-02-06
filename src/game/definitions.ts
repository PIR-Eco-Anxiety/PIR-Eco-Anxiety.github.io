import data from './data.json';

export interface Role {
    readonly id: number;
    readonly name: string;
    readonly description: string;
}

export interface Location {
    readonly id: number
    readonly name: string;
    readonly description: string;
}

export interface Event {
    readonly id: number;
    readonly name: string;
    readonly description: string;
}

export interface ActionCondition {
    readonly description: string;
}

export interface RoleLocationCondition extends ActionCondition {
    readonly roleId: number;
    readonly locationId: number;
}

export interface EventCondition extends ActionCondition {
    readonly eventId: number;
    readonly occurred: boolean;
}

export interface Action {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly points: number;
    readonly conditions: ActionCondition[];
}

export interface Game {
    readonly roles: Role[];
    readonly locations: Location[];
    readonly events: Event[];
    readonly actions: Action[];
}

export const game: Game = data;
