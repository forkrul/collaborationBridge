import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { FileUpload } from './FileUpload'
import { useState } from 'react'

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A file upload component with drag and drop support, progress tracking, validation, and multiple file handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'active', 'error', 'success'],
      description: 'Visual variant of the upload area',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the upload area',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable file upload',
    },
    autoUpload: {
      control: 'boolean',
      description: 'Automatically start upload when files are selected',
    },
    showFileList: {
      control: 'boolean',
      description: 'Show the list of uploaded files',
    },
  },
  args: {
    onFilesChange: fn(),
    onFileUpload: fn(),
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

// Basic file upload
export const Default: Story = {
  args: {
    uploadText: 'Click to upload or drag and drop',
    descriptionText: 'SVG, PNG, JPG or GIF (max. 800x400px)',
  },
}

// Multiple files
export const MultipleFiles: Story = {
  args: {
    multiple: true,
    maxFiles: 5,
    uploadText: 'Upload multiple files',
    descriptionText: 'Select up to 5 files',
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <FileUpload 
          size="sm"
          uploadText="Small upload area"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Medium</h3>
        <FileUpload 
          size="md"
          uploadText="Medium upload area"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <FileUpload 
          size="lg"
          uploadText="Large upload area"
        />
      </div>
    </div>
  ),
}

// File type restrictions
export const FileTypeRestrictions: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-sm font-medium mb-2">Images Only</h3>
        <FileUpload 
          accept="image/*"
          uploadText="Upload images"
          descriptionText="PNG, JPG, GIF files only"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Documents Only</h3>
        <FileUpload 
          accept=".pdf,.doc,.docx,.txt"
          uploadText="Upload documents"
          descriptionText="PDF, DOC, DOCX, TXT files only"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Specific Extensions</h3>
        <FileUpload 
          accept=".csv,.xlsx,.json"
          uploadText="Upload data files"
          descriptionText="CSV, XLSX, JSON files only"
        />
      </div>
    </div>
  ),
}

// Size limits
export const SizeLimits: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-2xl">
      <div>
        <h3 className="text-sm font-medium mb-2">Small Files (1MB max)</h3>
        <FileUpload 
          maxSize={1024 * 1024} // 1MB
          uploadText="Upload small files"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Large Files (50MB max)</h3>
        <FileUpload 
          maxSize={50 * 1024 * 1024} // 50MB
          uploadText="Upload large files"
        />
      </div>
    </div>
  ),
}

// Auto upload
export const AutoUpload: Story = {
  args: {
    autoUpload: true,
    multiple: true,
    uploadText: 'Files will upload automatically',
    descriptionText: 'Drop files here and they will start uploading immediately',
  },
}

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    uploadText: 'Upload disabled',
    descriptionText: 'File upload is currently disabled',
  },
}

// Without file list
export const WithoutFileList: Story = {
  args: {
    showFileList: false,
    multiple: true,
    uploadText: 'Upload files (no list shown)',
    descriptionText: 'Files will be uploaded but not displayed in a list',
  },
}

// Custom upload handler
export const CustomUploadHandler: Story = {
  render: () => {
    const [uploadStatus, setUploadStatus] = useState<string>('')

    const handleFileUpload = async (file: File) => {
      setUploadStatus(`Uploading ${file.name}...`)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure
      if (Math.random() > 0.3) {
        setUploadStatus(`✅ ${file.name} uploaded successfully`)
      } else {
        setUploadStatus(`❌ Failed to upload ${file.name}`)
        throw new Error('Upload failed')
      }
    }

    return (
      <div className="space-y-4 w-full max-w-2xl">
        <FileUpload 
          onFileUpload={handleFileUpload}
          autoUpload
          uploadText="Custom upload handler"
          descriptionText="Files will be processed with custom logic"
        />
        {uploadStatus && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">{uploadStatus}</p>
          </div>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom upload handler that simulates real upload process',
      },
    },
  },
}

// Profile picture upload
export const ProfilePictureUpload: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
      <FileUpload 
        accept="image/*"
        maxSize={2 * 1024 * 1024} // 2MB
        uploadText="Upload profile picture"
        descriptionText="PNG or JPG (max 2MB)"
        size="sm"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Profile picture upload with image restrictions and size limits',
      },
    },
  },
}

// Document upload form
export const DocumentUploadForm: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-6">
      <h3 className="text-lg font-semibold">Document Submission</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Required Documents
          </label>
          <FileUpload 
            accept=".pdf,.doc,.docx"
            multiple
            maxFiles={3}
            maxSize={10 * 1024 * 1024} // 10MB
            uploadText="Upload required documents"
            descriptionText="PDF, DOC, DOCX files only (max 10MB each, up to 3 files)"
            autoUpload
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">
            Supporting Images (Optional)
          </label>
          <FileUpload 
            accept="image/*"
            multiple
            maxFiles={5}
            maxSize={5 * 1024 * 1024} // 5MB
            uploadText="Upload supporting images"
            descriptionText="PNG, JPG, GIF files only (max 5MB each, up to 5 files)"
            size="sm"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete document submission form with multiple upload areas',
      },
    },
  },
}
