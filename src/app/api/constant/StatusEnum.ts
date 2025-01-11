export type StatusEnum = 'active' | 'inactive';
export const StatusEnum = {
  Active: 'active' as StatusEnum,
  Inactive: 'inactive' as StatusEnum,
};

export type FundTypeEnum = 'FundProfile' | 'FundMapping' | 'FundHoliday' | 'TradeCalendar' | 'Fee' | 'Nav' | 'FundPerformance';
export const FundTypeEnum = {
  FundProfile: 'FundProfile' as FundTypeEnum,
  FundMapping: 'FundMapping' as FundTypeEnum,
  FundHoliday: 'FundHoliday' as FundTypeEnum,
  TradeCalendar: 'TradeCalendar' as FundTypeEnum,
  Fee: 'Fee' as FundTypeEnum,
  Nav: 'Nav' as FundTypeEnum,
  FundPerformance: 'FundPerformance' as FundTypeEnum,

};

export type LastSyncEnum = 'done' | 'in_progress';
export const LastSyncEnum = {
  Done: 'done' as LastSyncEnum,
  Inprogress: 'in_progress' as LastSyncEnum,
};
