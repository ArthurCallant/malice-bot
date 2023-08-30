import { MembershipWithPlayer } from '@wise-old-man/utils';
import { DateTime } from 'luxon';

export type Type = 'sotw' | 'botw';

export type TopTenMetric = 'ttm' | 'exp' | 'ehb' | 'ehp' | 'pets' | 'log' | 'balance' | 'month';

export interface MessageBuilderOptions {
  sdString?: string;
  edString?: string;
  expStats?: { username: string; gained: number }[];
  ehbStats?: { username: string; gained: number }[];
  ehpStats?: { username: string; gained: number }[];
}

export interface Period {
  startDate: Date;
  endDate: Date;
}

export interface CompetitionCalendar {
  title: string;
  startDt: DateTime;
  endDt: DateTime;
  startDay: string;
  endDay: string;
  start: string;
  end: string;
  startTime: string;
  endTime: string;
}

export interface UserWithPoints {
  username: string;
  points: string;
}

export interface UserWithPets {
  username: string;
  pets: number;
}

export interface UserWithLogSlots {
  username: string;
  uniqueObtained: number;
}

export type BuildMessageUserArray = MembershipWithPlayer[] | UserWithPoints[] | UserWithPets[] | UserWithLogSlots[];
