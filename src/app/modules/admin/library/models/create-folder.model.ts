import { ShareWithUserId } from './list-content.model';

export class CreateFolderRequest {
  name: string;
  path: string;
  isPrivate: boolean;
  shareWithUserIds: ShareWithUserId[];
}

export class CreateFileRequest extends CreateFolderRequest {
  file: any;
  replaceWithSamePermissions: boolean;
}

export class DownloadDeleteFileOrFolderRequest {
  constructor(public path: string) {}
}
