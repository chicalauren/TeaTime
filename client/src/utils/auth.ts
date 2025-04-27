export function getToken(): string | null {
    return localStorage.getItem('id_token');
  }
  
  export function setToken(token: string): void {
    localStorage.setItem('id_token', token);
  }
  
  export function removeToken(): void {
    localStorage.removeItem('id_token');
  }
  