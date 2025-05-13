import { BonusQuestion, MULTIPLIER } from "./questions";

interface ActionBase {
  id: number;
  name: string;
  description: string;
  points: number;
  bonusQuestion?: BonusQuestion;
}

export function calculateScore(action: Action, correct: boolean): number {
  return Math.ceil(action.points * (correct ? MULTIPLIER : 1));
}

export interface SharedAction extends ActionBase {
  playerNumber: number;
  locationId: number;
}

export function isSharedAction(action: Action): action is SharedAction {
  return (action as SharedAction).playerNumber !== undefined;
}

export interface PersonalAction extends ActionBase {
  roleId: number;
  locationId: number;
}

export function isPersonalAction(action: Action): action is PersonalAction {
  return (action as PersonalAction).roleId !== undefined;
}

export interface GroupAction extends ActionBase {
  roleIds: number[];
  locationId: number;
}

export function isGroupAction(action: Action): action is GroupAction {
  return (action as GroupAction).roleIds !== undefined;
}

export type Action = SharedAction | PersonalAction | GroupAction;

export enum ActionType {
  SHARED,
  PERSONAL,
  GROUP
}

export function getActionType(action: Action): ActionType {
  if (isSharedAction(action)) {
    return ActionType.SHARED;
  } else if (isPersonalAction(action)) {
    return ActionType.PERSONAL;
  } else {
    return ActionType.GROUP;
  }
}

export function convertAction(action: Action, type: ActionType): Action {
  switch (type) {
    case ActionType.SHARED:
      return {
        id: action.id,
        name: action.name,
        description: action.description,
        points: action.points,
        bonusQuestion: action.bonusQuestion,
        playerNumber: 1,
        locationId: 0
      };
    case ActionType.PERSONAL:
      return {
        id: action.id,
        name: action.name,
        description: action.description,
        points: action.points,
        bonusQuestion: action.bonusQuestion,
        roleId: 0,
        locationId: 0
      };
    case ActionType.GROUP:
      return {
        id: action.id,
        name: action.name,
        description: action.description,
        points: action.points,
        bonusQuestion: action.bonusQuestion,
        roleIds: [],
        locationId: 0
      };
    
  }
}

export const defaultAction: Action = {
  id: 0,
  name: "",
  description: "",
  points: 0,
  playerNumber: 1,
  locationId: 0
}