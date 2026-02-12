import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

export interface GitHubCreateFileRequest {
  message: string;
  content: string;
  branch?: string;
  sha?: string; // Required for updates
}

export interface GitHubCreateFileResponse {
  content: GitHubFileContent;
  commit: {
    sha: string;
    node_id: string;
    url: string;
    html_url: string;
    author: any;
    committer: any;
    tree: any;
    message: string;
    parents: any[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly apiUrl = 'https://api.github.com';
  
  constructor(private http: HttpClient) {}

  /**
   * Get headers with GitHub authentication
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `token ${environment.github_pat}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    });
  }

  /**
   * Get file content from a repository
   * @param owner - Repository owner (username or organization)
   * @param repo - Repository name
   * @param path - File path in the repository
   * @param branch - Optional branch name (defaults to main)
   */
  getFile(owner: string, repo: string, path: string, branch: string = 'main'): Observable<GitHubFileContent> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    return this.http.get<GitHubFileContent>(url, { headers: this.getHeaders() });
  }

  /**
   * Create a new file in a repository
   * @param owner - Repository owner (username or organization)
   * @param repo - Repository name
   * @param path - File path where the file should be created
   * @param content - File content (will be base64 encoded automatically)
   * @param message - Commit message
   * @param branch - Optional branch name (defaults to main)
   */
  createFile(
    owner: string, 
    repo: string, 
    path: string, 
    content: string, 
    message: string,
    branch: string = 'main'
  ): Observable<GitHubCreateFileResponse> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${path}`;
    
    const body: GitHubCreateFileRequest = {
      message: message,
      content: this.encodeToBase64(content),
      branch: branch
    };

    return this.http.put<GitHubCreateFileResponse>(url, body, { headers: this.getHeaders() });
  }

  /**
   * Update an existing file in a repository
   * @param owner - Repository owner (username or organization)
   * @param repo - Repository name
   * @param path - File path of the file to update
   * @param content - New file content (will be base64 encoded automatically)
   * @param message - Commit message
   * @param sha - The blob SHA of the file being replaced (required for updates)
   * @param branch - Optional branch name (defaults to main)
   */
  updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha: string,
    branch: string = 'main'
  ): Observable<GitHubCreateFileResponse> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${path}`;
    
    const body: GitHubCreateFileRequest = {
      message: message,
      content: this.encodeToBase64(content),
      sha: sha,
      branch: branch
    };

    return this.http.put<GitHubCreateFileResponse>(url, body, { headers: this.getHeaders() });
  }

  /**
   * Delete a file from a repository
   * @param owner - Repository owner (username or organization)
   * @param repo - Repository name
   * @param path - File path of the file to delete
   * @param message - Commit message
   * @param sha - The blob SHA of the file being deleted
   * @param branch - Optional branch name (defaults to main)
   */
  deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    sha: string,
    branch: string = 'main'
  ): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${path}`;
    
    const options = {
      headers: this.getHeaders(),
      body: {
        message: message,
        sha: sha,
        branch: branch
      }
    };

    return this.http.delete(url, options);
  }

  /**
   * Encode content to Base64
   */
  private encodeToBase64(content: string): string {
    return btoa(unescape(encodeURIComponent(content)));
  }

  /**
   * Decode Base64 content
   */
  decodeFromBase64(content: string): string {
    return decodeURIComponent(escape(atob(content)));
  }

  /**
   * Helper method to create or update a file (checks if file exists first)
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param path - File path
   * @param content - File content
   * @param message - Commit message
   * @param branch - Optional branch name (defaults to main)
   */
  createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string = 'main'
  ): Observable<GitHubCreateFileResponse> {
    return new Observable(observer => {
      // Try to get the file first
      this.getFile(owner, repo, path, branch).subscribe({
        next: (fileData) => {
          // File exists, update it
          this.updateFile(owner, repo, path, content, message, fileData.sha, branch).subscribe({
            next: (response) => {
              observer.next(response);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          // File doesn't exist (404), create it
          if (error.status === 404) {
            this.createFile(owner, repo, path, content, message, branch).subscribe({
              next: (response) => {
                observer.next(response);
                observer.complete();
              },
              error: (createError) => {
                observer.error(createError);
              }
            });
          } else {
            observer.error(error);
          }
        }
      });
    });
  }
}
