import React from "react";
import { Button, Grid2 as Grid, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Modal } from ".";
import { LabelDataset, LabeledData } from "@/lib/ts/types";

interface LabelPreviewModalProps {
  download: (data: LabelDataset) => void;
  handleClose: () => void;
  dataset: LabelDataset;
  open: boolean;
  removeRow: (row: LabeledData) => void;
}

const LabelPreviewModal: React.FC<LabelPreviewModalProps> = ({
  download,
  handleClose,
  dataset,
  open,
  removeRow,
}) => (
  <Modal open={open} handleClose={handleClose} width={750}>
    <Grid
      direction="column"
      spacing={2}
      container
      maxHeight="100vh"
      sx={{ overflowY: "auto" }}
      wrap="nowrap"
    >
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" textAlign="center">
          Labeling summary
        </Typography>
      </Grid>

      <Grid container direction="column" spacing={0}>
        <Grid container direction="row">
          <Grid size={{ xs: 2 }}>
            <Typography fontWeight="bold">Name</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography fontWeight="bold">NSS Code</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">NSS Code Description</Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography fontWeight="bold">Edit/Remove</Typography>
          </Grid>
        </Grid>
        {dataset.labeledData
          .sort((a, b) => (a.nssCode.nss_code < b.nssCode.nss_code ? -1 : 1))
          .map((r) => (
            <Grid
              key={r.data.flip_id}
              container
              alignItems="center"
              direction="row"
              spacing={1}
              justifyContent="space-between"
            >
              <Grid size={{ xs: 2 }}>{r.data.product_name}</Grid>
              <Grid size={{ xs: 2 }}>{r.nssCode.nss_code}</Grid>
              <Grid size={{ xs: 6 }}>{r.nssCode.nss_description}</Grid>
              <Grid size={{ xs: 2 }}>
                <IconButton onClick={() => removeRow(r)}>
                  <Edit />
                </IconButton>
              </Grid>
            </Grid>
          ))}
      </Grid>
      <Grid container direction="row" justifyContent="space-between">
        <Grid>
          <Button
            onClick={() => {
              download(dataset);
              handleClose();
            }}
          >
            Download
          </Button>
        </Grid>
        <Grid>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Modal>
);

export default LabelPreviewModal;
