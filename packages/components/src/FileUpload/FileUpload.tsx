import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, formatBytes, generateId } from '@company/core'
import { Upload, X, File, Image, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '../Button'
import { Progress } from '../Progress'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  StandardComponentSize 
} from '@company/core'

const fileUploadVariants = cva(
  'border-2 border-dashed rounded-lg text-center transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border hover:border-primary/50',
        active: 'border-primary bg-primary/5',
        error: 'border-destructive bg-destructive/5',
        success: 'border-green-500 bg-green-50',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface UploadedFile {
  file: File
  id: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof fileUploadVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Callback when files change */
  onFilesChange?: (files: File[]) => void
  /** Callback for individual file upload */
  onFileUpload?: (file: File) => Promise<void>
  /** Accepted file types */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Whether the upload is disabled */
  disabled?: boolean
  /** Upload variant */
  variant?: 'default' | 'active' | 'error' | 'success'
  /** Size variant */
  size?: StandardComponentSize
  /** Custom upload text */
  uploadText?: string
  /** Custom description text */
  descriptionText?: string
  /** Whether to show file list */
  showFileList?: boolean
  /** Whether to auto-upload files */
  autoUpload?: boolean
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    className,
    onFilesChange,
    onFileUpload,
    accept,
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = 5,
    disabled = false,
    variant = 'default',
    size = 'md',
    uploadText = 'Click to upload or drag and drop',
    descriptionText,
    showFileList = true,
    autoUpload = false,
    'data-testid': testId,
    ...props
  }, ref) => {
    const [files, setFiles] = React.useState<UploadedFile[]>([])
    const [isDragOver, setIsDragOver] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <Image className="h-4 w-4" />
      } else if (file.type.includes('pdf') || file.type.includes('document')) {
        return <FileText className="h-4 w-4" />
      }
      return <File className="h-4 w-4" />
    }

    const validateFile = (file: File): string | undefined => {
      if (file.size > maxSize) {
        return `File size must be less than ${formatBytes(maxSize)}`
      }

      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim())
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          return file.type.match(type.replace('*', '.*'))
        })

        if (!isAccepted) {
          return `File type not accepted. Accepted types: ${accept}`
        }
      }

      return undefined
    }

    const simulateUpload = async (fileId: string) => {
      const uploadedFile = files.find(f => f.id === fileId)
      if (!uploadedFile) return

      if (onFileUpload) {
        try {
          await onFileUpload(uploadedFile.file)
          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, progress: 100, status: 'completed' as const }
              : file
          ))
        } catch (error) {
          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'error' as const, error: 'Upload failed' }
              : file
          ))
        }
      } else {
        // Simulate progress
        const interval = setInterval(() => {
          setFiles(prev => prev.map(file => {
            if (file.id === fileId && file.status === 'uploading') {
              const newProgress = Math.min(file.progress + Math.random() * 30, 100)
              return {
                ...file,
                progress: newProgress,
                status: newProgress === 100 ? 'completed' as const : 'uploading' as const
              }
            }
            return file
          }))
        }, 500)

        setTimeout(() => clearInterval(interval), 3000)
      }
    }

    const handleFiles = (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      
      if (!multiple && fileArray.length > 1) {
        return
      }
      
      if (files.length + fileArray.length > maxFiles) {
        return
      }

      const validFiles: UploadedFile[] = fileArray.map(file => {
        const error = validateFile(file)
        return {
          file,
          id: generateId('file'),
          progress: 0,
          status: error ? 'error' as const : 'uploading' as const,
          error
        }
      })

      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
      setFiles(updatedFiles)
      
      // Auto-upload valid files
      if (autoUpload) {
        validFiles.forEach(uploadedFile => {
          if (!uploadedFile.error) {
            simulateUpload(uploadedFile.id)
          }
        })
      }

      onFilesChange?.(updatedFiles.map(f => f.file))
    }

    const removeFile = (fileId: string) => {
      const updatedFiles = files.filter(f => f.id !== fileId)
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles.map(f => f.file))
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) {
        setIsDragOver(true)
      }
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      
      if (disabled) return
      
      const droppedFiles = e.dataTransfer.files
      handleFiles(droppedFiles)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files)
      }
    }

    const openFileDialog = () => {
      if (!disabled) {
        fileInputRef.current?.click()
      }
    }

    const effectiveVariant = isDragOver ? 'active' : variant
    const defaultDescription = [
      accept && `Accepted formats: ${accept}`,
      `Max size: ${formatBytes(maxSize)}`,
      multiple && `Max files: ${maxFiles}`
    ].filter(Boolean).join(' • ')

    return (
      <div ref={ref} className={cn('space-y-4', className)} data-testid={testId} {...props}>
        {/* Upload Area */}
        <div
          className={cn(
            fileUploadVariants({ variant: effectiveVariant, size }),
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isDragOver ? 'Drop files here' : uploadText}
            </p>
            <p className="text-xs text-muted-foreground">
              {descriptionText || defaultDescription}
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
        </div>

        {/* File List */}
        {showFileList && files.length > 0 && (
          <div className="space-y-2">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center space-x-3 p-3 border rounded-lg"
              >
                <div className="flex-shrink-0">
                  {getFileIcon(uploadedFile.file)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(uploadedFile.file.size)}
                  </p>
                  
                  {uploadedFile.status === 'uploading' && (
                    <Progress 
                      value={uploadedFile.progress} 
                      className="mt-1" 
                      size="sm"
                    />
                  )}
                  
                  {uploadedFile.error && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {uploadedFile.error}
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0 flex items-center gap-2">
                  {uploadedFile.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="h-6 w-6 p-0"
                    aria-label="Remove file"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export { FileUpload, fileUploadVariants }
