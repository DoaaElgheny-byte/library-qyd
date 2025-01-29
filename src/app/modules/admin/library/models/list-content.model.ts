export class ListResponse {
  contents: CreateFolderFileResponse[];
}

export enum AppEntityState {
  None = 0,
  Added = 1,
  Updated = 2,
  Deleted = 3,
}
export class ShareWithUserId {
  constructor(public userId: string,public entityState: AppEntityState) {}
}

export class CreateFolderFileResponse {
  isFolder: boolean;
  name: string;
  path: string;
  sizeInBytes: number;
  userId: string;
  userName: string;
  isPrivate: boolean;
  creationDate: string;
  privateOwnerUser: PrivateObjectOwnerAndShared;
  shareWithUsers: PrivateObjectOwnerAndShared[];
}

export class PrivateObjectOwnerAndShared {
  id: string;
  name: string;
  date: string;
}

export class ListRequest {
  constructor(public path:string) {}
}
