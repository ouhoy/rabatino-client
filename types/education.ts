import { type Post } from './shared'

export enum InstitutionType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  LIBRARY = 'LIBRARY',
  COACHING_CENTER = 'COACHING_CENTER',
  STUDY_CENTER = 'STUDY_CENTER'
}

export interface EducationalInstitution extends Post {
  isVerified: boolean;
  private: boolean;
  type: InstitutionType;
}

export interface College extends EducationalInstitution {
  departments: string[];
  specialization: string;
  affiliation: string;
  hasNote: boolean;
  facilities: string[];
}

export interface University extends EducationalInstitution {
  faculties: string[];
  ranking: string;
  accreditation: string;
  hasHousing: boolean;
  researchCenters: string[];
  facilities: string[];
}

export interface Library extends EducationalInstitution {
  bookCount: number;
  sections: string[];
  hasDigitalAccess: boolean;
  operationHours: string;
  hasPrinting: boolean;
  hasStudyRooms: boolean;
}

export interface StudyCenter extends EducationalInstitution {
  capacity: number;
  amenities: string[];
  hourlyRateRange: number[];
  has24Access: boolean;
  rooms: string[];
}

export interface CoachingCenter extends EducationalInstitution {
  specialty: string;
  courses: string[];
  schedule: string;
}
