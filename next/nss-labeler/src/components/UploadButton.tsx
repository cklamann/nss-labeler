"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Papa from "papaparse";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadButtonButton: React.FC<ButtonProps> = ({ children, variant }) => (
  <Button
    component="label"
    role={undefined}
    variant={variant}
    tabIndex={-1}
    startIcon={<CloudUploadIcon />}
  >
    {children}
  </Button>
);

interface UploadButtonProps {
  variant?: ButtonProps["variant"];
  onUpload: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload, variant }) => (
  <UploadButtonButton variant={variant}>
    Upload Unlabeled Data
    <VisuallyHiddenInput
      type="file"
      onChange={({ target: { files } }) => files && onUpload(files[0])}
    />
  </UploadButtonButton>
);

export default UploadButton;
