import { DateTime } from 'luxon';

export type Type = 'sotw' | 'botw';

export type Metric = 'ttm' | 'exp' | 'ehb' | 'ehp' | 'pets' | 'log' | 'balance';
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
