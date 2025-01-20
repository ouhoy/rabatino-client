import { type Post } from './shared'

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP'
}

export enum WorkLocation {
  REMOTE = 'REMOTE',
  OFFICE = 'OFFICE',
  HYBRID = 'HYBRID'
}

export interface JobPost extends Post {
  company: string;
  website: string;
  logo: string;
  location: string;
  salary: string;
  jobType: JobType;
  workLocation: WorkLocation;
  requirements: string[];
  applicationLink: string;
  expiryDate: Date;
  isActive: boolean;
}
