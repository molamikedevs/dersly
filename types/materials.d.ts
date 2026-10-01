type MaterialKind = 'guide' | 'link' | 'article';

export interface MaterialRecord {
  id: string;
  classId: string | null;
  title: string;
  description: string | null;
  kind: MaterialKind;
  content: string | null;
  url: string | null;
  level: ClassLevel | null;
  uploadedAt: string;
}
