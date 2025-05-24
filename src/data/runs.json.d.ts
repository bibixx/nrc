export interface Root {
  data: Data;
}

export interface Data {
  platform: string;
  marketplace: string;
  language: string;
  units: string;
  lastModified: string;
  audioGuidedRuns: Array<AudioGuidedRun>;
}

export interface AudioGuidedRun {
  id: string;
  properties: Properties;
  landing: Landing;
  detail: Detail;
  triggers: Array<any>;
}

export interface Properties {
  activeGoal: number;
  autodownload: boolean;
  goal: number;
  activityType: string;
  profiles: Array<any>;
  previousId?: string;
  previousIds?: Array<string>;
}

export interface Landing {
  title: string;
  subtitle: string;
  url: string;
  featuredUrl: string;
  backgroundColor: string;
  titleColor: string;
}

export interface Detail {
  autopause: string;
  audioFeedback: string;
  activityVoiceovers: string;
  metricVoiceovers: string;
  accentColor: string;
  headerCard: HeaderCard;
  content: Array<Content>;
}

export interface HeaderCard {
  title: string;
  subtitle: string;
  url: string;
  backgroundColor: string;
  titleColor: string;
}

export interface Content {
  type: string;
  title: string;
  body?: string;
  titleColor: string;
  backgroundColor: string;
  providers: Array<Provider>;
  url?: string;
}

export interface Provider {
  type: string;
  url: string;
}
