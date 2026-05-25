export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  credentialId?: string;
}

export const certifications: Certification[] = [];
