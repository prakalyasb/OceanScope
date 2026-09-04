import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import type { UploadFile } from '../types/oceanData';
import './Upload.css';

export default function Upload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      file,
      name: file.name,
      type: file.type || getFileType(file.name),
      size: file.size,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...uploadFiles]);

    // Simulate upload and processing
    uploadFiles.forEach((uploadFile, index) => {
      simulateUpload(uploadFile, index);
    });
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'nc': return 'NetCDF';
      case 'csv': return 'CSV';
      case 'json': return 'JSON';
      default: return 'Unknown';
    }
  };

  const simulateUpload = (uploadFile: UploadFile, index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate processing
        setTimeout(() => {
          setFiles(prev => prev.map((f, i) => {
            if (i === index) {
              return {
                ...f,
                status: 'processing',
                progress: 100
              };
            }
            return f;
          }));

          // Simulate processing completion
          setTimeout(() => {
            setFiles(prev => prev.map((f, i) => {
              if (i === index) {
                return {
                  ...f,
                  status: 'ready',
                  parsedVariables: ['temperature', 'salinity', 'depth', 'time']
                };
              }
              return f;
            }));
          }, 2000);
        }, 500);
      }

      setFiles(prev => prev.map((f, i) => {
        if (i === index) {
          return { ...f, progress };
        }
        return f;
      }));
    }, 200);

    // Use uploadFile to avoid unused parameter warning
    void uploadFile;
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="status-icon ready" />;
      case 'error':
        return <XCircle className="status-icon error" />;
      case 'processing':
        return <Clock className="status-icon processing" />;
      default:
        return <UploadIcon className="status-icon uploading" />;
    }
  };

  const getStatusText = (status: UploadFile['status']) => {
    switch (status) {
      case 'ready': return 'Ready for visualization';
      case 'error': return 'Processing failed';
      case 'processing': return 'Processing data...';
      default: return 'Uploading...';
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <div className="header-content">
          <div className="header-title">
            <UploadIcon className="header-icon" />
            <h1>Data Upload</h1>
          </div>
          <p className="header-subtitle">
            Upload your oceanographic data files for visualization and analysis
          </p>
        </div>
      </div>

      <div className="upload-content">
        {/* Upload Zone */}
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            multiple
            accept=".nc,.csv,.json"
            onChange={handleFileSelect}
            className="file-input"
          />
          <label htmlFor="file-input" className="upload-label">
            <UploadIcon className="upload-icon" />
            <div className="upload-text">
              <h3>Drag & drop files here</h3>
              <p>or click to browse</p>
            </div>
            <div className="upload-formats">
              <span>Supported formats:</span>
              <span className="format-tag">NetCDF</span>
              <span className="format-tag">CSV</span>
              <span className="format-tag">JSON</span>
            </div>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list">
            <h3 className="file-list-title">Uploaded Files</h3>
            <div className="file-items">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <div className="file-icon">
                      <FileText />
                    </div>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        <span className="file-type">{file.type}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="file-status">
                    <div className="status-indicator">
                      {getStatusIcon(file.status)}
                      <span className="status-text">{getStatusText(file.status)}</span>
                    </div>

                    {file.status === 'uploading' && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}

                    {file.status === 'ready' && file.parsedVariables && (
                      <div className="parsed-variables">
                        <span className="variables-label">Variables:</span>
                        {file.parsedVariables.map((variable, i) => (
                          <span key={i} className="variable-tag">{variable}</span>
                        ))}
                      </div>
                    )}

                    <button 
                      className="remove-btn"
                      onClick={() => removeFile(index)}
                      title="Remove file"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="upload-info">
          <h3 className="info-title">Upload Guidelines</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>NetCDF Files</h4>
              <p>Climate and Forecast (CF) compliant NetCDF files with coordinate variables and data dimensions.</p>
            </div>
            <div className="info-item">
              <h4>CSV Files</h4>
              <p>Comma-separated values with headers. Must include columns for time, location, and measurements.</p>
            </div>
            <div className="info-item">
              <h4>JSON Files</h4>
              <p>Structured JSON data following OceanScope schema with metadata and measurement arrays.</p>
            </div>
            <div className="info-item">
              <h4>File Size</h4>
              <p>Maximum file size: 500MB. Larger files should be split into multiple uploads.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}