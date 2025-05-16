export interface AuthResponse {
  jwtToken: string;
  user: {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
    profileImg: string;
  }
}