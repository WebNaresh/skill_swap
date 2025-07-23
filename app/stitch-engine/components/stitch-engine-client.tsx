"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  FileImage,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversionResult {
  success: boolean;
  filename: string;
  blob?: Blob;
  error?: string;
}

export function StitchEngineClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [svgPreview, setSvgPreview] = useState<string | null>(null);
  const [conversionDetails, setConversionDetails] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.includes("svg")) {
      setError("Please select a valid SVG file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setConversionResult(null);

    // Read and preview SVG content
    try {
      const svgContent = await file.text();
      setSvgPreview(svgContent);

      // Parse SVG to show details
      const svgData = parseSvgContent(svgContent);
      setConversionDetails(
        `SVG Analysis:\n` +
          `• Dimensions: ${Math.round(svgData.width)} × ${Math.round(
            svgData.height
          )} units\n` +
          `• Found ${svgData.paths.length} shape(s) to convert:\n` +
          svgData.paths
            .map(
              (path: any, index: number) =>
                `  - ${path.type} (${
                  path.fill !== "none" ? "filled" : "outline"
                })`
            )
            .join("\n")
      );
    } catch (err) {
      setError("Failed to read SVG file");
      setSvgPreview(null);
      setConversionDetails(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const convertSvgToDst = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setConversionProgress(0);
    setError(null);

    try {
      // Simulate conversion progress
      const progressInterval = setInterval(() => {
        setConversionProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Read SVG file content
      const svgContent = await selectedFile.text();

      // Validate SVG content
      if (!svgContent.includes("<svg")) {
        throw new Error("Invalid SVG file: No SVG element found");
      }

      // Parse SVG to get conversion details
      const svgData = parseSvgContent(svgContent);

      if (svgData.paths.length === 0) {
        throw new Error("No convertible shapes found in SVG");
      }

      // Convert SVG to DST format with timeout
      const dstContent = (await Promise.race([
        mockSvgToDstConversion(svgContent),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Conversion timeout - SVG too complex")),
            10000
          )
        ),
      ])) as ArrayBuffer;

      clearInterval(progressInterval);
      setConversionProgress(100);

      // Create blob for download
      const blob = new Blob([dstContent], { type: "application/octet-stream" });
      const filename = selectedFile.name.replace(".svg", ".dst");

      // Update conversion details with results
      setConversionDetails(
        `Conversion Complete!\n\n` +
          `Original SVG:\n` +
          `• Dimensions: ${Math.round(svgData.width)} × ${Math.round(
            svgData.height
          )} units\n` +
          `• Shapes processed: ${svgData.paths.length}\n\n` +
          `Generated DST File:\n` +
          `• File size: ${(dstContent.byteLength / 1024).toFixed(1)} KB\n` +
          `• Estimated stitches: ${Math.floor(dstContent.byteLength / 3)}\n` +
          `• Ready for embroidery machines`
      );

      setConversionResult({
        success: true,
        filename,
        blob,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Conversion failed";
      console.error("Conversion error:", err);

      setError(errorMessage);
      setConversionResult({
        success: false,
        filename: "",
        error: errorMessage,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const downloadDstFile = () => {
    if (!conversionResult?.blob) return;

    const url = URL.createObjectURL(conversionResult.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = conversionResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConversionResult(null);
    setError(null);
    setConversionProgress(0);
    setSvgPreview(null);
    setConversionDetails(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Information Card */}
      <Card className="border-sky-200 bg-sky-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-700">
            <Info className="w-5 h-5" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-sky-600">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-sky-500" />
              <p className="font-medium">1. Upload SVG</p>
              <p>Select your vector design file</p>
            </div>
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-sky-500" />
              <p className="font-medium">2. Convert</p>
              <p>Process to embroidery format</p>
            </div>
            <div className="text-center">
              <Download className="w-8 h-8 mx-auto mb-2 text-sky-500" />
              <p className="font-medium">3. Download</p>
              <p>Get your DST embroidery file</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload SVG File</CardTitle>
          <CardDescription>
            Select an SVG file to convert to DST embroidery format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragActive
                ? "border-sky-400 bg-sky-50"
                : "border-gray-300 hover:border-sky-400",
              selectedFile && "border-green-400 bg-green-50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-medium text-green-700">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <FileImage className="w-12 h-12 mx-auto text-gray-400" />
                <p className="font-medium">
                  Drop your SVG file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports SVG files up to 10MB
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* SVG Preview and Analysis */}
      {selectedFile && svgPreview && (
        <Card>
          <CardHeader>
            <CardTitle>SVG Preview & Analysis</CardTitle>
            <CardDescription>
              Preview of your SVG file and conversion analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* SVG Preview */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Visual Preview</h4>
                <div className="border rounded-lg p-4 bg-white min-h-[200px] max-h-[300px] flex items-center justify-center overflow-hidden">
                  <div
                    className="max-w-full max-h-full flex items-center justify-center"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "250px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="w-auto h-auto max-w-full max-h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                      style={{
                        maxWidth: "280px",
                        maxHeight: "220px",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          svgPreview?.replace(
                            /<svg([^>]*)>/,
                            '<svg$1 style="max-width: 100%; max-height: 100%; width: auto; height: auto;">'
                          ) || "",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Conversion Details */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Conversion Analysis</h4>
                <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {conversionDetails}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Controls */}
      {selectedFile && !conversionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Convert to DST</CardTitle>
            <CardDescription>
              Process your SVG file to create an embroidery-ready DST file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting...</span>
                  <span>{conversionProgress}%</span>
                </div>
                <Progress value={conversionProgress} className="w-full" />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={convertSvgToDst}
                disabled={isConverting}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Convert to DST
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={resetConverter}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Result */}
      {conversionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {conversionResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Conversion Complete
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Conversion Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversionResult.success ? (
              <div className="space-y-4">
                <p className="text-green-700">
                  Your SVG file has been successfully converted to DST format.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadDstFile}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {conversionResult.filename}
                  </Button>
                  <Button variant="outline" onClick={resetConverter}>
                    Convert Another File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">
                    {conversionResult.error}
                  </AlertDescription>
                </Alert>
                <Button variant="outline" onClick={resetConverter}>
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// SVG to DST conversion function with actual SVG parsing
async function mockSvgToDstConversion(
  svgContent: string
): Promise<ArrayBuffer> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Parse SVG content to extract paths and shapes
  const svgData = parseSvgContent(svgContent);

  // Convert SVG data to DST format
  return createDstFile(svgData);
}

// Parse SVG content to extract meaningful data
function parseSvgContent(svgContent: string) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");

  if (!svgElement) {
    throw new Error("Invalid SVG content");
  }

  // Get SVG dimensions
  const width = parseFloat(svgElement.getAttribute("width") || "100");
  const height = parseFloat(svgElement.getAttribute("height") || "100");
  const viewBox = svgElement.getAttribute("viewBox");

  let actualWidth = width;
  let actualHeight = height;

  if (viewBox) {
    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    actualWidth = vbWidth || width;
    actualHeight = vbHeight || height;
  }

  // Extract paths, rectangles, circles, and other shapes
  const paths: Array<{
    type: string;
    data: string;
    fill?: string;
    stroke?: string;
  }> = [];

  // Extract path elements
  svgDoc.querySelectorAll("path").forEach((path) => {
    const d = path.getAttribute("d");
    if (d) {
      paths.push({
        type: "path",
        data: d,
        fill: path.getAttribute("fill") || "#000000",
        stroke: path.getAttribute("stroke") || "none",
      });
    }
  });

  // Extract rectangle elements
  svgDoc.querySelectorAll("rect").forEach((rect) => {
    const x = parseFloat(rect.getAttribute("x") || "0");
    const y = parseFloat(rect.getAttribute("y") || "0");
    const w = parseFloat(rect.getAttribute("width") || "0");
    const h = parseFloat(rect.getAttribute("height") || "0");

    // Convert rectangle to path
    const pathData = `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${
      y + h
    } Z`;

    const fill = rect.getAttribute("fill");
    const stroke = rect.getAttribute("stroke");

    paths.push({
      type: "rect",
      data: pathData,
      fill: fill === "none" ? "none" : fill || "#000000",
      stroke: stroke || "none",
    });
  });

  // Extract circle elements
  svgDoc.querySelectorAll("circle").forEach((circle) => {
    const cx = parseFloat(circle.getAttribute("cx") || "0");
    const cy = parseFloat(circle.getAttribute("cy") || "0");
    const r = parseFloat(circle.getAttribute("r") || "0");

    // Convert circle to path (approximate with 16 points for smoother embroidery)
    const points = [];
    const numPoints = 16; // More points for smoother circles
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * Math.PI * 2) / numPoints;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    points.push("Z");

    const fill = circle.getAttribute("fill");
    const stroke = circle.getAttribute("stroke");

    paths.push({
      type: "circle",
      data: points.join(" "),
      fill: fill === "none" ? "none" : fill || "#000000",
      stroke: stroke || "none",
    });
  });

  // Extract line elements
  svgDoc.querySelectorAll("line").forEach((line) => {
    const x1 = parseFloat(line.getAttribute("x1") || "0");
    const y1 = parseFloat(line.getAttribute("y1") || "0");
    const x2 = parseFloat(line.getAttribute("x2") || "0");
    const y2 = parseFloat(line.getAttribute("y2") || "0");

    const pathData = `M${x1},${y1} L${x2},${y2}`;
    paths.push({
      type: "line",
      data: pathData,
      fill: "none",
      stroke: line.getAttribute("stroke") || "#000000",
    });
  });

  // Extract ellipse elements
  svgDoc.querySelectorAll("ellipse").forEach((ellipse) => {
    const cx = parseFloat(ellipse.getAttribute("cx") || "0");
    const cy = parseFloat(ellipse.getAttribute("cy") || "0");
    const rx = parseFloat(ellipse.getAttribute("rx") || "0");
    const ry = parseFloat(ellipse.getAttribute("ry") || "0");

    // Convert ellipse to path
    const points = [];
    const numPoints = 16;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * Math.PI * 2) / numPoints;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    points.push("Z");

    const fill = ellipse.getAttribute("fill");
    const stroke = ellipse.getAttribute("stroke");

    paths.push({
      type: "ellipse",
      data: points.join(" "),
      fill: fill === "none" ? "none" : fill || "#000000",
      stroke: stroke || "none",
    });
  });

  // Extract polygon elements
  svgDoc.querySelectorAll("polygon").forEach((polygon) => {
    const points = polygon.getAttribute("points");
    if (points) {
      // Convert points string to path data
      const coords = points
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      const pathParts = [];

      for (let i = 0; i < coords.length; i += 2) {
        if (i + 1 < coords.length) {
          const command = i === 0 ? "M" : "L";
          pathParts.push(`${command}${coords[i]},${coords[i + 1]}`);
        }
      }
      pathParts.push("Z");

      const fill = polygon.getAttribute("fill");
      const stroke = polygon.getAttribute("stroke");

      paths.push({
        type: "polygon",
        data: pathParts.join(" "),
        fill: fill === "none" ? "none" : fill || "#000000",
        stroke: stroke || "none",
      });
    }
  });

  // Extract polyline elements
  svgDoc.querySelectorAll("polyline").forEach((polyline) => {
    const points = polyline.getAttribute("points");
    if (points) {
      // Convert points string to path data
      const coords = points
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      const pathParts = [];

      for (let i = 0; i < coords.length; i += 2) {
        if (i + 1 < coords.length) {
          const command = i === 0 ? "M" : "L";
          pathParts.push(`${command}${coords[i]},${coords[i + 1]}`);
        }
      }
      // Note: polyline doesn't close, so no "Z"

      const fill = polyline.getAttribute("fill");
      const stroke = polyline.getAttribute("stroke");

      paths.push({
        type: "polyline",
        data: pathParts.join(" "),
        fill: fill === "none" ? "none" : fill || "none",
        stroke: stroke || "#000000",
      });
    }
  });

  return {
    width: actualWidth,
    height: actualHeight,
    paths: paths,
  };
}

// Create DST file from parsed SVG data
function createDstFile(svgData: any): ArrayBuffer {
  const stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }> = [];

  // Convert each path to stitches
  svgData.paths.forEach((pathInfo: any) => {
    const pathStitches = convertPathToStitches(
      pathInfo.data,
      pathInfo.fill !== "none"
    );
    stitches.push(...pathStitches);
  });

  // Add end stitch
  stitches.push({ x: 0, y: 0, type: "end" });

  // Create DST header
  const header = createDstHeader(
    svgData.width,
    svgData.height,
    stitches.length
  );

  // Create DST stitch data
  const stitchData = createDstStitchData(stitches);

  // Combine header and stitch data
  const result = new Uint8Array(header.length + stitchData.length);
  result.set(header, 0);
  result.set(stitchData, header.length);

  return result.buffer;
}

// Convert SVG path to embroidery stitches
function convertPathToStitches(
  pathData: string,
  isFilled: boolean
): Array<{ x: number; y: number; type: "move" | "stitch" | "jump" | "end" }> {
  const stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }> = [];

  // Parse the path to get polygon points
  const pathPoints = parsePathToPoints(pathData);

  if (pathPoints.length === 0) {
    return stitches;
  }

  if (isFilled) {
    // Create fill stitches for filled shapes
    const fillStitches = createFillStitches(pathPoints);
    stitches.push(...fillStitches);
  } else {
    // Create outline stitches for non-filled shapes
    const outlineStitches = createOutlineStitches(pathPoints);
    stitches.push(...outlineStitches);
  }

  return stitches;
}

// Parse SVG path data to get array of points
function parsePathToPoints(pathData: string): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const commands =
    pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];

  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  commands.forEach((command) => {
    const type = command[0];
    const coords = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    switch (type.toLowerCase()) {
      case "m": // Move to
        if (coords.length >= 2) {
          const x = type === "M" ? coords[0] : currentX + coords[0];
          const y = type === "M" ? coords[1] : currentY + coords[1];
          points.push({ x, y });
          currentX = startX = x;
          currentY = startY = y;
        }
        break;

      case "l": // Line to
        for (let i = 0; i < coords.length; i += 2) {
          if (i + 1 < coords.length) {
            const x = type === "L" ? coords[i] : currentX + coords[i];
            const y = type === "L" ? coords[i + 1] : currentY + coords[i + 1];
            points.push({ x, y });
            currentX = x;
            currentY = y;
          }
        }
        break;

      case "h": // Horizontal line
        coords.forEach((coord) => {
          const x = type === "H" ? coord : currentX + coord;
          points.push({ x, y: currentY });
          currentX = x;
        });
        break;

      case "v": // Vertical line
        coords.forEach((coord) => {
          const y = type === "V" ? coord : currentY + coord;
          points.push({ x: currentX, y });
          currentY = y;
        });
        break;

      case "z": // Close path
        if (currentX !== startX || currentY !== startY) {
          points.push({ x: startX, y: startY });
          currentX = startX;
          currentY = startY;
        }
        break;
    }
  });

  return points;
}

// Create fill stitches for filled shapes
function createFillStitches(points: Array<{ x: number; y: number }>): Array<{
  x: number;
  y: number;
  type: "move" | "stitch" | "jump" | "end";
}> {
  const stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }> = [];

  if (points.length < 3) {
    return createOutlineStitches(points);
  }

  try {
    // Find bounding box
    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));

    // Limit the size to prevent excessive processing
    const maxDimension = 500; // Maximum dimension for fill processing
    const width = maxX - minX;
    const height = maxY - minY;

    if (width > maxDimension || height > maxDimension) {
      // For very large shapes, just create outline stitches
      console.warn("Shape too large for fill stitches, using outline only");
      return createOutlineStitches(points);
    }

    const stitchSpacing = Math.max(2, Math.min(width, height) / 50); // Adaptive spacing
    let isFirstStitch = true;
    let stitchCount = 0;
    const maxStitches = 1000; // Limit total stitches to prevent overflow

    // Create horizontal fill lines
    for (
      let y = minY;
      y <= maxY && stitchCount < maxStitches;
      y += stitchSpacing
    ) {
      const intersections = findLineIntersections(points, y);

      if (intersections.length >= 2 && intersections.length <= 20) {
        // Limit intersections
        // Sort intersections by x coordinate
        intersections.sort((a, b) => a - b);

        // Create stitches between pairs of intersections
        for (
          let i = 0;
          i < intersections.length && stitchCount < maxStitches;
          i += 2
        ) {
          if (i + 1 < intersections.length) {
            const startX = intersections[i];
            const endX = intersections[i + 1];

            // Skip very small segments
            if (Math.abs(endX - startX) < 1) continue;

            // Add stitches along the fill line
            const lineStitches = createLineStitches(
              { x: startX, y },
              { x: endX, y },
              isFirstStitch
            );

            stitches.push(...lineStitches);
            stitchCount += lineStitches.length;
            isFirstStitch = false;
          }
        }
      }
    }

    // Add simplified outline for definition
    const outlineStitches = createSimplifiedOutline(points);
    stitches.push(...outlineStitches);

    return stitches;
  } catch (error) {
    console.error("Error creating fill stitches:", error);
    // Fallback to outline stitches
    return createOutlineStitches(points);
  }
}

// Find intersections of a horizontal line with the polygon
function findLineIntersections(
  points: Array<{ x: number; y: number }>,
  y: number
): number[] {
  const intersections: number[] = [];

  if (points.length < 2) return intersections;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];

    // Skip horizontal lines
    if (Math.abs(p1.y - p2.y) < 0.001) continue;

    // Check if the line segment crosses the horizontal line
    if ((p1.y <= y && p2.y > y) || (p1.y > y && p2.y <= y)) {
      // Calculate intersection point
      const denominator = p2.y - p1.y;
      if (Math.abs(denominator) > 0.001) {
        // Avoid division by zero
        const t = (y - p1.y) / denominator;
        if (t >= 0 && t <= 1) {
          // Ensure intersection is within the line segment
          const x = p1.x + t * (p2.x - p1.x);
          // Avoid duplicate intersections
          if (!intersections.some((existing) => Math.abs(existing - x) < 0.1)) {
            intersections.push(x);
          }
        }
      }
    }
  }

  return intersections;
}

// Create simplified outline for complex shapes
function createSimplifiedOutline(
  points: Array<{ x: number; y: number }>
): Array<{
  x: number;
  y: number;
  type: "move" | "stitch" | "jump" | "end";
}> {
  const stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }> = [];

  if (points.length === 0) return stitches;

  // Simplify the outline by reducing points
  const simplifiedPoints = simplifyPoints(points, 5); // Tolerance of 5 units

  // Move to first point
  stitches.push({
    x: simplifiedPoints[0].x,
    y: simplifiedPoints[0].y,
    type: "jump",
  });

  // Create stitches along the simplified outline
  for (let i = 1; i < simplifiedPoints.length; i++) {
    const lineStitches = createLineStitches(
      simplifiedPoints[i - 1],
      simplifiedPoints[i],
      false
    );
    stitches.push(...lineStitches.slice(1)); // Skip the first point as it's already added
  }

  return stitches;
}

// Simplify points using Douglas-Peucker algorithm (simplified version)
function simplifyPoints(
  points: Array<{ x: number; y: number }>,
  tolerance: number
): Array<{ x: number; y: number }> {
  if (points.length <= 2) return points;

  const simplified: Array<{ x: number; y: number }> = [];

  // Take every nth point to reduce complexity
  const step = Math.max(1, Math.floor(points.length / 20)); // Max 20 points

  for (let i = 0; i < points.length; i += step) {
    simplified.push(points[i]);
  }

  // Always include the last point if it's not already included
  if (simplified[simplified.length - 1] !== points[points.length - 1]) {
    simplified.push(points[points.length - 1]);
  }

  return simplified;
}

// Create outline stitches for non-filled shapes
function createOutlineStitches(points: Array<{ x: number; y: number }>): Array<{
  x: number;
  y: number;
  type: "move" | "stitch" | "jump" | "end";
}> {
  const stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }> = [];

  if (points.length === 0) return stitches;

  // Move to first point
  stitches.push({ x: points[0].x, y: points[0].y, type: "move" });

  // Create stitches along the outline
  for (let i = 1; i < points.length; i++) {
    const lineStitches = createLineStitches(points[i - 1], points[i], false);
    stitches.push(...lineStitches.slice(1)); // Skip the first point as it's already added
  }

  return stitches;
}

// Create stitches along a line between two points
function createLineStitches(
  start: { x: number; y: number },
  end: { x: number; y: number },
  isFirstStitch: boolean
): Array<{ x: number; y: number; type: "move" | "stitch" | "jump" | "end" }> {
  const stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }> = [];

  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  const maxStitchLength = 3; // 3 units max stitch length

  if (isFirstStitch) {
    stitches.push({ x: start.x, y: start.y, type: "move" });
  } else {
    stitches.push({ x: start.x, y: start.y, type: "stitch" });
  }

  if (distance > maxStitchLength) {
    const steps = Math.ceil(distance / maxStitchLength);
    for (let step = 1; step <= steps; step++) {
      const ratio = step / steps;
      const x = start.x + (end.x - start.x) * ratio;
      const y = start.y + (end.y - start.y) * ratio;
      stitches.push({ x, y, type: "stitch" });
    }
  } else {
    stitches.push({ x: end.x, y: end.y, type: "stitch" });
  }

  return stitches;
}

// Create DST header with proper metadata
function createDstHeader(
  width: number,
  height: number,
  stitchCount: number
): Uint8Array {
  const header = new Array(512).fill(0x20); // Initialize with spaces

  // DST header format
  const headerText = [
    `LA:${" ".repeat(16)}`, // Label (16 chars)
    `ST:${stitchCount.toString().padStart(7, "0")}\r\n`, // Stitch count
    `CO:01\r\n`, // Color changes
    `+X:${Math.round(width).toString().padStart(6, "0")}\r\n`, // Positive X extent
    `-X:000000\r\n`, // Negative X extent
    `+Y:${Math.round(height).toString().padStart(6, "0")}\r\n`, // Positive Y extent
    `-Y:000000\r\n`, // Negative Y extent
    `AX:+${Math.round(width / 2)
      .toString()
      .padStart(5, "0")}\r\n`, // Absolute X
    `AY:+${Math.round(height / 2)
      .toString()
      .padStart(5, "0")}\r\n`, // Absolute Y
    `MX:+00000\r\n`, // Move X
    `MY:+00000\r\n`, // Move Y
    `PD:*\r\n`, // Pattern description
  ].join("");

  // Convert to bytes
  const headerBytes = new TextEncoder().encode(headerText);
  const result = new Uint8Array(512);
  result.set(headerBytes.slice(0, Math.min(headerBytes.length, 511)));
  result[511] = 0x1a; // End of header marker

  return result;
}

// Create DST stitch data from stitch array
function createDstStitchData(
  stitches: Array<{
    x: number;
    y: number;
    type: "move" | "stitch" | "jump" | "end";
  }>
): Uint8Array {
  const data: number[] = [];
  let lastX = 0;
  let lastY = 0;

  stitches.forEach((stitch) => {
    const deltaX = Math.round(stitch.x - lastX);
    const deltaY = Math.round(stitch.y - lastY);

    // DST format uses 3-byte encoding for each stitch
    let byte1 = 0,
      byte2 = 0,
      byte3 = 0;

    // Encode delta X (max ±121)
    const clampedDeltaX = Math.max(-121, Math.min(121, deltaX));
    const clampedDeltaY = Math.max(-121, Math.min(121, deltaY));

    // DST encoding logic
    if (clampedDeltaX >= 0) {
      byte1 |= clampedDeltaX & 0x7f;
    } else {
      byte1 |= (-clampedDeltaX & 0x7f) | 0x80;
    }

    if (clampedDeltaY >= 0) {
      byte2 |= clampedDeltaY & 0x7f;
    } else {
      byte2 |= (-clampedDeltaY & 0x7f) | 0x80;
    }

    // Set stitch type flags
    switch (stitch.type) {
      case "move":
      case "jump":
        byte3 |= 0x83; // Jump/move flag
        break;
      case "end":
        byte3 |= 0xf3; // End flag
        break;
      default:
        byte3 |= 0x03; // Normal stitch
        break;
    }

    data.push(byte1, byte2, byte3);

    lastX = stitch.x;
    lastY = stitch.y;
  });

  return new Uint8Array(data);
}
