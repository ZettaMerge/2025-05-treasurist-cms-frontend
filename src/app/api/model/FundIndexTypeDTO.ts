import { IndexTypeDTO } from "./IndexTypeDTO"

export interface FundIndexTypeDTO {
  id: number
  fundCode: string
  fundRiskLevel: string
  amcCode: string
  indexTypeName: string
  nav: number
  navDate: string
  isActive: boolean
  }