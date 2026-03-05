import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, Check, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function UploadArtworkPage() {
  const { token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.svg', '.ai', '.eps'];
  const maxFileSize = 100 * 1024 * 1024; // 100MB
  
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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);
  
  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        toast.error(`${file.name} exceeds 100MB limit`);
        return;
      }
      
      // Check file type
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFormats.includes(extension)) {
        toast.error(`${file.name} is not a supported format`);
        return;
      }
      
      setUploadedFiles(prev => [...prev, file]);
      toast.success(`${file.name} uploaded successfully`);
    });
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !token) {
      toast.error('Please sign in to upload artwork.');
      navigate('/login');
      return;
    }
    if (uploadedFiles.length === 0) return;

    setIsSubmitting(true);
    let successCount = 0;

    for (const file of uploadedFiles) {
      try {
        const formData = new FormData();
        formData.append('artwork', file);
        const res = await fetch(`${BACKEND_URL}/api/artwork/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
        } else {
          toast.error(`${file.name}: ${data.message}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsSubmitting(false);
    if (successCount > 0) {
      toast.success(`${successCount} file${successCount > 1 ? 's' : ''} submitted for review!`);
      setUploadedFiles([]);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0B0F17] pt-32 pb-20">
      <div className="rp-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="rp-micro-label block mb-4">ARTWORK UPLOAD</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F6F8FF] mb-4">
            Upload Your Custom Artwork
          </h1>
          <p className="text-lg text-[#A6B0C5] max-w-2xl mx-auto">
            Drag and drop your files or click to browse. We'll check them and get back to you with a quote.
          </p>
        </motion.div>
        
        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative p-12 rounded-[28px] border-2 border-dashed cursor-pointer transition-all ${
              isDragging
                ? 'border-[#3B6CFF] bg-[rgba(59,108,255,0.1)]'
                : 'border-[rgba(246,248,255,0.15)] hover:border-[rgba(246,248,255,0.30)]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFormats.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[rgba(246,248,255,0.06)] flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-[#3B6CFF]" />
              </div>
              <p className="text-lg font-medium text-[#F6F8FF] mb-2">
                {isDragging ? 'Drop files here' : 'Drag & drop your files'}
              </p>
              <p className="text-sm text-[#A6B0C5]">
                or click to browse from your computer
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* File Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rp-card p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#3B6CFF] mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-[#F6F8FF] mb-2">File Requirements</h3>
              <ul className="text-sm text-[#A6B0C5] space-y-1">
                <li>• Accepted formats: PDF, PNG, JPEG, SVG, AI, EPS</li>
                <li>• Maximum file size: 100MB per file</li>
                <li>• For best results, use 300 DPI resolution</li>
                <li>• Include 3mm bleed on all sides</li>
                <li>• Convert text to outlines or embed fonts</li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-[#F6F8FF] mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-3 mb-8">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-[rgba(246,248,255,0.04)] border border-[rgba(246,248,255,0.08)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(59,108,255,0.2)] flex items-center justify-center">
                      <File className="w-5 h-5 text-[#3B6CFF]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F6F8FF]">{file.name}</p>
                      <p className="text-xs text-[#A6B0C5]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-[#A6B0C5] hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#3B6CFF] hover:bg-[#2a5aee] text-white py-6"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Uploading...</>
                ) : (
                  <><Check className="w-5 h-5 mr-2" />Submit for Review</>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setUploadedFiles([])}
                className="border-[rgba(246,248,255,0.20)] text-[#F6F8FF] py-6"
              >
                Clear All
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
