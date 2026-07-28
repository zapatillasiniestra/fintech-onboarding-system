import {ApplicationStatus} from "../types/application";

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateApplicationBody {
  full_name: string;
  email: string;
}

export interface UpdateStatusBody {
  status: ApplicationStatus;
}

export {}