export interface ISubscriptions {
  "@odata.context": string;
  value: Value[];
}

export interface Value {
  id: string;
  catalogId: string;
  serviceIdentifier: string;
  state: string;
}
