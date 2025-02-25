
// for registering
export interface UserClass {
  displayName: string;
  phone: string;
  password: string;
  level: string;
  experienceYears: string;
  address: string;
  id?: string;
}

export interface RegisterRespose {
  _id: string;
  displayName: string
  "access_token": string;
  "refresh_token": string;
}

export interface LogoutClass {
  token: string
}

export interface LoginClass {
  phone: string;
  password: string
}

export interface LoginResponse {
  _id: string;
  "access_token": string;
  "refresh_token": string;
}

export interface ProfileResponse {
  _id: string;
  displayName: string;
  username: string;
  roles: [
    "user"
  ];
  active: boolean;
  experienceYears: number;
  address: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  __v: 0
}

export interface RefreshResponse {
  "access_token": string
}






