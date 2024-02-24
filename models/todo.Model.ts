export interface ITodoTask {
  "@odata.context": string;
  "@odata.etag": string;
  displayName: string;
  isOwner: boolean;
  isShared: boolean;
  wellknownListName: string;
  id: string;
}
