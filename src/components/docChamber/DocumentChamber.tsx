import React, { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";
import { Upload, FileText, PenTool } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker using react-pdf's bundled worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Log PDF.js version for debugging
console.log("PDF.js version:", pdfjs.version);

type Status = "Draft" | "In Review" | "Signed";

const DocumentChamber: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [status, setStatus] = useState<Status>("Draft");
  const [pdfError, setPdfError] = useState<string | null>(null);
  const sigRef = useRef<SignatureCanvas>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      alert("File size too large. Please select a file smaller than 10MB.");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type. Please select a PDF, DOC, or DOCX file.");
      return;
    }

    setFile(selectedFile);
    setStatus("Draft");
    setPdfError(null);
    sigRef.current?.clear();
  };

  const handlePdfLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setStatus("In Review");
    setPdfError(null);
  };

  const handlePdfError = (error: Error) => {
    console.error("PDF loading error:", error);
    console.error("File details:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      lastModified: file?.lastModified
    });
    setPdfError(`Failed to load PDF: ${error.message}. Please ensure the file is a valid, uncorrupted PDF.`);
    setStatus("Draft");
  };

  const handleSign = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("Please add a signature first.");
      return;
    }
    setStatus("Signed");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Review and sign deals and contracts</p>
        </div>
        <Badge
          variant={status === "Signed" ? "success" : status === "In Review" ? "primary" : "warning"}
          className="text-sm font-medium"
        >
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Upload size={20} />
              Upload Document
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileText size={32} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload document
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF (with preview) or DOC/DOCX • Max 10MB
                  </span>
                </label>
              </div>

              {file && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary-600" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          {file?.type === "application/pdf" && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900">Document Preview</h2>
              </CardHeader>
              <CardBody>
                {pdfError ? (
                  <div className="text-center py-8">
                    <FileText size={48} className="text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">
                      PDF Loading Error
                    </h3>
                    <p className="text-red-500">{pdfError}</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setPdfError(null);
                        setFile(null);
                      }}
                    >
                      Try Different File
                    </Button>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-auto border rounded-lg p-4 bg-gray-50">
                    <Document
                      file={file}
                      onLoadSuccess={handlePdfLoad}
                      onLoadError={handlePdfError}
                      loading={
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading PDF...</p>
                        </div>
                      }
                    >
                      {Array.from({ length: numPages }, (_, i) => (
                        <Page
                          key={i}
                          pageNumber={i + 1}
                          width={Math.min(600, window.innerWidth - 100)}
                          className="mb-4 shadow-sm border"
                        />
                      ))}
                    </Document>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {file && file.type !== "application/pdf" && (
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {file.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Document uploaded successfully
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Preview is only available for PDF files.
                      For DOC/DOCX files, you can still add your signature below.
                      Consider converting to PDF for full preview functionality.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Signature Section */}
          {file && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <PenTool size={20} />
                  E-Signature
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <SignatureCanvas
                      ref={sigRef}
                      penColor="black"
                      canvasProps={{
                        width: 600,
                        height: 200,
                        className: "bg-white rounded border",
                      }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => sigRef.current?.clear()}
                    >
                      Clear Signature
                    </Button>
                    <Button
                      onClick={handleSign}
                      disabled={status === "Signed"}
                    >
                      {status === "Signed" ? "Document Signed" : "Sign Document"}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentChamber;
