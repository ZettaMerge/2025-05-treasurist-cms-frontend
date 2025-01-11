export interface PaymentTermDTO {
  agentFeFee: number;
  agentFee: number;
  agentProFee: number;
  agentTrFee: number;
  createdBy: string;
  createdDate: Date;
  deletedBy: string;
  deletedDate: Date;
  description: string;
  feFeeFileName: string;
  id: number;
  paymentDate: Date;
  proFeeFileName: string;
  status: string;
  total: number;
  trFeeFileName: string;
  tsrFee: number;
  updatedBy: string;
  updatedDate: Date;
}

