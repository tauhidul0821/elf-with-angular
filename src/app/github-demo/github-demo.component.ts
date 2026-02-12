import { Component } from '@angular/core';
import { GitHubService } from '../../services/github.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-github-demo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './github-demo.component.html',
  styleUrl: './github-demo.component.css'
})
export class GitHubDemoComponent {
  // Repository details
  owner: string = 'tauhidul0821'; // e.g., 'your-username'
  repo: string = 'elf-with-angular'; // e.g., 'test-repo'
  filePath: string = 'docs/README.md'; // Path where file will be created
  branch: string = 'main';

  // File content
  fileContent: string = `# Documentation

This is a test documentation file created via GitHub API.

## Features
- Create files
- Update files
- Delete files

## Usage
This file was created automatically using Angular and GitHub REST API.

Created at: ${new Date().toISOString()}
`;

  commitMessage: string = 'Add/Update documentation';

  // Status messages
  statusMessage: string = '';
  isLoading: boolean = false;
  currentFileSha: string = '';

  constructor(private githubService: GitHubService) {}

  /**
   * Create a new file in the repository
   */
  createFile(): void {
    if (!this.validateInputs()) return;

    this.isLoading = true;
    this.statusMessage = 'Creating file...';

    this.githubService.createFile(
      this.owner,
      this.repo,
      this.filePath,
      this.fileContent,
      this.commitMessage,
      this.branch
    ).subscribe({
      next: (response) => {
        this.currentFileSha = response.content.sha;
        this.statusMessage = `✅ File created successfully! SHA: ${response.content.sha}`;
        this.isLoading = false;
        console.log('Create response:', response);
      },
      error: (error) => {
        this.statusMessage = `❌ Error creating file: ${error.error?.message || error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Fetch existing file content
   */
  fetchFile(): void {
    if (!this.validateInputs()) return;

    this.isLoading = true;
    this.statusMessage = 'Fetching file...';

    this.githubService.getFile(
      this.owner,
      this.repo,
      this.filePath,
      this.branch
    ).subscribe({
      next: (response) => {
        this.currentFileSha = response.sha;
        this.fileContent = this.githubService.decodeFromBase64(response.content);
        this.statusMessage = `✅ File fetched successfully! SHA: ${response.sha}`;
        this.isLoading = false;
        console.log('File content:', this.fileContent);
      },
      error: (error) => {
        this.statusMessage = `❌ Error fetching file: ${error.error?.message || error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Update existing file
   */
  updateFile(): void {
    if (!this.validateInputs()) return;

    if (!this.currentFileSha) {
      this.statusMessage = '⚠️ Please fetch the file first to get its SHA, or use Create/Update option';
      return;
    }

    this.isLoading = true;
    this.statusMessage = 'Updating file...';

    this.githubService.updateFile(
      this.owner,
      this.repo,
      this.filePath,
      this.fileContent,
      this.commitMessage,
      this.currentFileSha,
      this.branch
    ).subscribe({
      next: (response) => {
        this.currentFileSha = response.content.sha;
        this.statusMessage = `✅ File updated successfully! New SHA: ${response.content.sha}`;
        this.isLoading = false;
        console.log('Update response:', response);
      },
      error: (error) => {
        this.statusMessage = `❌ Error updating file: ${error.error?.message || error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Create or update file (automatically handles both cases)
   */
  createOrUpdateFile(): void {
    if (!this.validateInputs()) return;

    this.isLoading = true;
    this.statusMessage = 'Creating or updating file...';

    this.githubService.createOrUpdateFile(
      this.owner,
      this.repo,
      this.filePath,
      this.fileContent,
      this.commitMessage,
      this.branch
    ).subscribe({
      next: (response) => {
        this.currentFileSha = response.content.sha;
        this.statusMessage = `✅ File created/updated successfully! SHA: ${response.content.sha}`;
        this.isLoading = false;
        console.log('Create/Update response:', response);
      },
      error: (error) => {
        this.statusMessage = `❌ Error: ${error.error?.message || error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Delete file
   */
  deleteFile(): void {
    if (!this.validateInputs()) return;

    if (!this.currentFileSha) {
      this.statusMessage = '⚠️ Please fetch the file first to get its SHA';
      return;
    }

    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    this.isLoading = true;
    this.statusMessage = 'Deleting file...';

    this.githubService.deleteFile(
      this.owner,
      this.repo,
      this.filePath,
      `Delete ${this.filePath}`,
      this.currentFileSha,
      this.branch
    ).subscribe({
      next: (response) => {
        this.currentFileSha = '';
        this.statusMessage = `✅ File deleted successfully!`;
        this.isLoading = false;
        console.log('Delete response:', response);
      },
      error: (error) => {
        this.statusMessage = `❌ Error deleting file: ${error.error?.message || error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Append timestamp to content (for demo purposes)
   */
  appendTimestamp(): void {
    this.fileContent += `\n\n---\nUpdated at: ${new Date().toISOString()}`;
  }

  /**
   * Validate required inputs
   */
  private validateInputs(): boolean {
    if (!this.owner || !this.repo || !this.filePath) {
      this.statusMessage = '⚠️ Please fill in Owner, Repository, and File Path';
      return false;
    }
    return true;
  }

  /**
   * Clear status message
   */
  clearStatus(): void {
    this.statusMessage = '';
  }
}
