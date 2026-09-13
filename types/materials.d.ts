type MaterialKind = 'file' | 'link';

export interface MaterialRecord {
  id: string;
  classId: string | null;
  title: string;
  description: string | null;
  kind: MaterialKind;
  filePath: string | null;
  url: string | null;
  level: ClassLevel | null;
  uploadedAt: string;
}
