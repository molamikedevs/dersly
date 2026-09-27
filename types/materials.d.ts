type MaterialKind = 'file' | 'link' | 'article';

export interface MaterialRecord {
  id: string;
  classId: string | null;
  title: string;
  description: string | null;
  kind: MaterialKind;
  filePath: string | null;
  fileName: string | null;
  url: string | null;
  signedUrl?: string | null;
  downloadUrl?: string | null;
  level: ClassLevel | null;
  uploadedAt: string;
}
