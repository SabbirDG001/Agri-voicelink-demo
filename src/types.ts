export interface StatItem {
  value: string;
  label: string;
  desc: string;
}

export interface HighlightCardItem {
  title: string;
  desc: string;
  tag: string;
}

export interface ObjectiveItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  points: string[];
  color: string;
}

export interface TechDetailItem {
  title: string;
  desc: string;
  tags: string[];
  icon: string;
}

export interface TimelineQuarterItem {
  phase: string;
  title: string;
  desc: string;
  status: string;
}

export interface SdgItem {
  num: string;
  title: string;
  desc: string;
  color: string;
}

export interface TeamMemberItem {
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  role: string;
  avatar?: string;
  org: string;
  email?: string;
  phone?: string;
}

export interface AboutValueItem {
  title: string;
  desc: string;
}

export interface AboutPartnerItem {
  name: string;
  role: string;
}

export interface AboutUsData {
  introduction: string;
  vision: string;
  mission: string;
  coreValues: AboutValueItem[];
  partners: AboutPartnerItem[];
}

export interface PublicationItem {
  title: string;
  authors: string;
  venue: string;
  year: string;
  type: string;
  link?: string;
  abstract?: string;
  tags: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  author: string;
  category: "Milestone" | "Publication" | "Event" | "Field Trial";
  summary: string;
  content: string;
  thumbnail: string;
  tags: string[];
}

export interface ProjectData {
  stats: StatItem[];
  highlightCards: HighlightCardItem[];
  objectives: ObjectiveItem[];
  techDetails: TechDetailItem[];
  timelineQuarters: TimelineQuarterItem[];
  sdgs: SdgItem[];
  teamMembers: TeamMemberItem[];
  aboutUs: AboutUsData;
  publications: PublicationItem[];
}
