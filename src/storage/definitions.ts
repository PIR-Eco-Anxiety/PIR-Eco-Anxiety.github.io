export interface ActionCompletion {
    actionId: number;
    completed: boolean;
}

export interface PlayerLocation {
    roleId: number;
    locationId: number;
}

export interface EventOccurrence {
    eventId: number;
    occurred: boolean;
}