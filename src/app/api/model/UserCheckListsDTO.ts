
export interface UserCheckListsDTO {
  birthdate: Date;
  checkListType: CheckListTypeDTO;
  code: string;
  createdBy: string;
  createdDate: Date;
  firstName: string;
  id: number;
  identifyNo: string;
  isActive: boolean;
  lastName: string;
  type: string;
  updatedBy: string;
  updatedDate: Date;
}

export interface CheckListTypeDTO {
  createdBy: string;
  createdDate: Date;
  id: number;
  isActive: boolean;
  typeName: string;
  updatedBy: string;
  updatedDate: Date;
}


