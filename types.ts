
export interface RomanticSpot {
  title: string;
  uri: string;
}

export type AppStage = 'QUESTION' | 'PRE_CELEBRATION' | 'CELEBRATION';

export interface UserContext {
  isValentine: boolean;
  generatedLetter?: string;
}
