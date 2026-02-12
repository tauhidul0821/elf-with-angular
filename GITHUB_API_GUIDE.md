# GitHub REST API Integration Guide

This guide explains how to use the GitHub REST API integration to create and manage documentation files in your GitHub repositories.

## 🚀 What's Included

1. **GitHubService** - Complete service for GitHub REST API operations
2. **GitHub Demo Component** - Interactive UI to test all GitHub operations
3. **Full CRUD Operations** - Create, Read, Update, and Delete files

## 📋 Prerequisites

### 1. GitHub Personal Access Token

You already have a token configured in `environment.ts`, but make sure it has the correct permissions:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token or verify existing token has these scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `public_repo` - Access public repositories

### 2. GitHub Repository

You need a GitHub repository to test with:
- Can be public or private (token needs appropriate permissions)
- Example: Create a test repository like `github-api-test`

## 🎯 Quick Start

### Step 1: Run the Application

```bash
npm start
```

The app will open at `http://localhost:4200` and automatically navigate to the GitHub Demo page.

### Step 2: Configure Repository Details

Fill in the form fields:
- **Repository Owner**: Your GitHub username (e.g., `yourusername`)
- **Repository Name**: Your test repository (e.g., `github-api-test`)
- **Branch**: The branch to work with (default: `main`)
- **File Path**: Where to create the file (e.g., `docs/README.md`)

### Step 3: Try the Operations

#### Option A: Smart Create/Update (Recommended)
1. Click **"🔄 Create or Update"** button
2. This automatically checks if the file exists and creates or updates accordingly
3. No need to fetch SHA manually!

#### Option B: Manual Control
1. Click **"➕ Create File"** to create a new file
2. Click **"📥 Fetch File"** to get existing file content and SHA
3. Modify the content
4. Click **"✏️ Update File"** to save changes
5. Click **"🗑️ Delete File"** to remove the file

## 📚 Using the GitHub Service in Your Code

### Basic Import

```typescript
import { GitHubService } from '../services/github.service';

constructor(private githubService: GitHubService) {}
```

### Create a File

```typescript
this.githubService.createFile(
  'your-username',           // owner
  'your-repo',              // repository name
  'docs/api-reference.md',  // file path
  '# API Reference\n\nYour content here',  // content
  'Add API documentation',  // commit message
  'main'                    // branch (optional, defaults to 'main')
).subscribe({
  next: (response) => {
    console.log('File created!', response);
    console.log('File SHA:', response.content.sha);
    console.log('File URL:', response.content.html_url);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### Get File Content

```typescript
this.githubService.getFile(
  'your-username',
  'your-repo',
  'docs/api-reference.md',
  'main'
).subscribe({
  next: (file) => {
    // Decode Base64 content
    const content = this.githubService.decodeFromBase64(file.content);
    console.log('File content:', content);
    console.log('File SHA:', file.sha);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### Update a File

```typescript
// First, get the file to obtain its SHA
this.githubService.getFile('owner', 'repo', 'path/to/file.md').subscribe({
  next: (file) => {
    const sha = file.sha;
    
    // Now update with the SHA
    this.githubService.updateFile(
      'owner',
      'repo',
      'path/to/file.md',
      '# Updated Content\n\nNew documentation',
      'Update documentation',
      sha,  // Required!
      'main'
    ).subscribe({
      next: (response) => {
        console.log('File updated!', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
});
```

### Smart Create or Update

The easiest way - automatically handles both scenarios:

```typescript
this.githubService.createOrUpdateFile(
  'your-username',
  'your-repo',
  'docs/changelog.md',
  '# Changelog\n\n## v1.0.0\n- Initial release',
  'Add changelog',
  'main'
).subscribe({
  next: (response) => {
    console.log('File created or updated!', response);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### Delete a File

```typescript
// First, get the file SHA
this.githubService.getFile('owner', 'repo', 'path/to/file.md').subscribe({
  next: (file) => {
    // Now delete with the SHA
    this.githubService.deleteFile(
      'owner',
      'repo',
      'path/to/file.md',
      'Remove old documentation',
      file.sha,
      'main'
    ).subscribe({
      next: () => {
        console.log('File deleted!');
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
});
```

## 🔧 API Reference

### GitHubService Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getFile()` | owner, repo, path, branch? | `Observable<GitHubFileContent>` | Get file content and metadata |
| `createFile()` | owner, repo, path, content, message, branch? | `Observable<GitHubCreateFileResponse>` | Create a new file |
| `updateFile()` | owner, repo, path, content, message, sha, branch? | `Observable<GitHubCreateFileResponse>` | Update existing file |
| `deleteFile()` | owner, repo, path, message, sha, branch? | `Observable<any>` | Delete a file |
| `createOrUpdateFile()` | owner, repo, path, content, message, branch? | `Observable<GitHubCreateFileResponse>` | Smart create or update |
| `decodeFromBase64()` | content | `string` | Decode Base64 content |

### Response Types

```typescript
interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string;
  content: string;      // Base64 encoded
  encoding: string;     // "base64"
}

interface GitHubCreateFileResponse {
  content: GitHubFileContent;
  commit: {
    sha: string;
    message: string;
    // ... more fields
  };
}
```

## 💡 Common Use Cases

### 1. Auto-Generate Documentation

```typescript
generateDocs(apiData: any): void {
  const markdown = this.convertToMarkdown(apiData);
  
  this.githubService.createOrUpdateFile(
    'my-org',
    'documentation',
    'api/endpoints.md',
    markdown,
    `Auto-update API docs - ${new Date().toISOString()}`,
    'main'
  ).subscribe({
    next: () => console.log('Docs updated!'),
    error: (err) => console.error('Failed:', err)
  });
}
```

### 2. Version Control for Configs

```typescript
saveConfig(config: any): void {
  const yamlContent = YAML.stringify(config);
  
  this.githubService.createOrUpdateFile(
    'my-org',
    'configs',
    'app-config.yml',
    yamlContent,
    `Update config: ${config.version}`,
    'production'
  ).subscribe();
}
```

### 3. Automated Changelog

```typescript
addToChangelog(version: string, changes: string[]): void {
  // Fetch current changelog
  this.githubService.getFile('owner', 'repo', 'CHANGELOG.md').subscribe({
    next: (file) => {
      const current = this.githubService.decodeFromBase64(file.content);
      const newEntry = `\n## ${version} - ${new Date().toLocaleDateString()}\n${changes.map(c => `- ${c}`).join('\n')}\n`;
      const updated = newEntry + current;
      
      this.githubService.updateFile(
        'owner', 'repo', 'CHANGELOG.md',
        updated,
        `Add changelog for ${version}`,
        file.sha
      ).subscribe();
    }
  });
}
```

## 🔒 Security Best Practices

1. **Never commit tokens to version control**
   - Use environment variables
   - Add `.env` to `.gitignore`
   - Use different tokens for dev/prod

2. **Minimum Required Permissions**
   - Only grant necessary scopes
   - Use fine-grained tokens if possible
   - Rotate tokens regularly

3. **Validate Input**
   - Sanitize file paths
   - Validate repository access
   - Handle errors gracefully

## 🐛 Troubleshooting

### "Bad credentials" Error
- Check your token in `environment.ts`
- Verify token hasn't expired
- Ensure token has `repo` scope

### "Not Found" Error
- Verify repository owner and name
- Check if repository exists
- Confirm token has access to the repository

### "Conflict" Error on Update
- File SHA has changed
- Fetch the latest version first
- Use `createOrUpdateFile()` for automatic handling

### CORS Issues
- GitHub API should work from browser
- If issues persist, consider proxy server
- Check browser console for details

## 📖 Additional Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Contents API Reference](https://docs.github.com/en/rest/repos/contents)
- [Authentication Guide](https://docs.github.com/en/rest/overview/authenticating-to-the-rest-api)

## 🎉 Next Steps

1. Try the demo page to understand the workflow
2. Create a test repository for experimentation
3. Integrate the service into your Angular components
4. Build automation workflows for documentation
5. Add error handling and user feedback

## 💬 Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your token permissions
3. Test with the demo component first
4. Review the GitHub API rate limits

Happy coding! 🚀
