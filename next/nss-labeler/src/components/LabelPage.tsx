"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LabelingSection, LabelPreviewModal } from ".";
import { StaticDataContext } from "@/providers/StaticDataProvider";
import {
  LabelDataset,
  LabeledData,
  NSSCode,
  UnlabeledData,
} from "@/lib/ts/types";
import { downloadCsv } from "@/lib/util";
import { FlipDataTable, UploadButton } from "@/components";

const labelSort = (a: UnlabeledData, b: UnlabeledData) =>
  a.product_name < b.product_name ? -1 : 1;

const LabelPage: React.FC = () => {
  const { tras, nssCodes } = useContext(StaticDataContext);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [rowsToLabel, setRowsToLabel] = useState<LabelDataset | null>();

  const [searchType, setSearchType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTraItem, setSelectedTraItem] = useState("");

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  const [unlabeledData, setUnlabeledData] = useState<UnlabeledData[] | null>(
    null,
  );

  const [visibleData, setVisibleData] = useState<UnlabeledData[] | null>(null);

  useEffect(() => {
    if (unlabeledData) {
      let filteredData = unlabeledData.slice();

      filteredData = filteredData.filter((d) =>
        selectedTraItem ? d.tra_item === selectedTraItem : true,
      );

      if (searchType === "all") {
        filteredData = filteredData.filter((row) =>
          Object.values(row).join(" ").toLowerCase().includes(searchTerm),
        );
      }
      if (searchType === "name") {
        filteredData = filteredData.filter((row) =>
          row.product_name.toLowerCase().includes(searchTerm),
        );
      }

      setVisibleData(filteredData);
    }
  }, [searchType, searchTerm, unlabeledData, selectedTraItem]);

  useEffect(() => {
    setSelectedRowIds([]);
  }, [selectedTraItem]);

  const InitializeRowsToLabel = useCallback(() => {
    if (!selectedRowIds.length || !selectedTraItem) {
      return setRowsToLabel(null);
    } else {
      return setRowsToLabel({
        datasetName: "New Dataset",
        tra_item: selectedTraItem,
        tra_item_description: tras!.find((t) => t.cat === selectedTraItem)!.def,
        unlabeledData: (unlabeledData || [])
          ?.filter((d) => selectedRowIds.includes(d.flip_id))
          .sort(labelSort),
        labeledData: [],
      });
    }
  }, [selectedRowIds, selectedTraItem, unlabeledData]);

  useEffect(() => {
    if (rowsToLabel && selectedTraItem) {
      const currentlyLabeling = rowsToLabel.unlabeledData
        .concat(rowsToLabel.labeledData.map((d) => d.data))
        .map((d) => d.flip_id);

      const newData = (unlabeledData || []).filter(
        (d) =>
          !currentlyLabeling.includes(d.flip_id) &&
          selectedRowIds.includes(d.flip_id),
      );

      setRowsToLabel({
        ...rowsToLabel,
        unlabeledData: newData.concat(rowsToLabel.unlabeledData),
      });
    }
  }, [selectedRowIds]);

  const downloadAndReset = (rowsToLabel: LabelDataset) => {
    if (!!rowsToLabel?.labeledData.length) {
      downloadCsv(
        rowsToLabel.labeledData.map((ld) => ({
          flip_id: ld.data.flip_id,
          nss_code: ld.nssCode.nss_code,
        })),
        `${selectedTraItem}.csv`,
      );
    }
    setSelectedTraItem("");
    setRowsToLabel(null);
  };

  const setRowLabeled = useCallback(
    (row: UnlabeledData, nssCode: NSSCode) => {
      if (rowsToLabel) {
        setRowsToLabel({
          ...rowsToLabel,
          unlabeledData: rowsToLabel.unlabeledData
            .filter((r) => r.flip_id !== row.flip_id)
            .sort(labelSort),
          labeledData: rowsToLabel.labeledData.concat({
            nssCode,
            data: row,
          }),
        });
      }
    },
    [rowsToLabel],
  );

  const setRowUnlabeled = useCallback(
    (row: LabeledData) => {
      if (rowsToLabel) {
        setRowsToLabel({
          ...rowsToLabel,
          unlabeledData: rowsToLabel.unlabeledData
            .concat(row.data)
            .sort(labelSort),
          labeledData: rowsToLabel.labeledData.filter(
            (d) => d.data.flip_id !== row.data.flip_id,
          ),
        });
      }
    },
    [rowsToLabel],
  );

  const parseCsv = async (csv: File) => {
    const parsed = await new Promise<UnlabeledData[]>((resolve) =>
      Papa.parse<UnlabeledData>(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (v) => resolve(v.data),
      }),
    );
    setUnlabeledData(parsed);
  };

  return !!visibleData ? (
    <Grid container direction="column" spacing={2}>
      {!!rowsToLabel && (
        <Grid container>
          <LabelingSection
            dataToLabel={rowsToLabel}
            nssCodes={nssCodes!}
            setRowLabeled={setRowLabeled}
            setRowUnlabeled={setRowUnlabeled}
            removeRow={(row: UnlabeledData) => {
              setRowsToLabel({
                ...rowsToLabel,
                unlabeledData: rowsToLabel.unlabeledData.filter(
                  (d) => d.flip_id !== row.flip_id,
                ),
              });
              setSelectedRowIds(
                selectedRowIds.filter((r) => r !== row.flip_id),
              );
            }}
          />
        </Grid>
      )}
      <Grid container direction="row">
        <Grid container direction="row" alignItems="center">
          <Grid container justifyContent="flex-start" alignItems="center">
            <Grid>
              <TextField
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </Grid>
            <Grid>
              <TextField
                label="Search Type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                select
                sx={{ width: "200px" }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="name">Product Name</MenuItem>
                <MenuItem value="ingredients">Ingredients</MenuItem>
              </TextField>
            </Grid>
            <Grid>
              <TextField
                disabled={!!selectedTraItem && !!rowsToLabel}
                label="TRA Item"
                value={selectedTraItem || ""}
                onChange={(e) => setSelectedTraItem(e.target.value)}
                select
                sx={{ width: "200px" }}
              >
                <MenuItem value={""}>None</MenuItem>
                {(tras || []).map((t) => (
                  <MenuItem value={t.cat} key={t.cat}>
                    <Typography title={t.def}>{t.cat}</Typography>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid>
              <Typography>
                {selectedRowIds.length} / {visibleData.length.toLocaleString()}{" "}
                selected
              </Typography>
            </Grid>
            <Grid>
              <Button
                onClick={() =>
                  setSelectedRowIds(visibleData.map((v) => v.flip_id))
                }
                disabled={!selectedTraItem}
              >
                select all
              </Button>
            </Grid>
            <Grid>
              <Button
                onClick={() => setSelectedRowIds([])}
                disabled={!selectedTraItem}
              >
                unselect all
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          flexGrow={1}
        >
          <Grid>
            <Button
              disabled={!rowsToLabel?.labeledData.length}
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={() => setPreviewModalOpen(true)}
            >
              Preview and Download
            </Button>
            <Button
              disabled={!selectedRowIds.length || !!rowsToLabel}
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={InitializeRowsToLabel}
            >
              Start Labeling
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid width="100%" maxHeight="700px">
        {!!unlabeledData && (
          <FlipDataTable
            data={visibleData}
            labeledIds={
              rowsToLabel?.labeledData.map((d) => d.data.flip_id) || []
            }
            selectedRowIds={selectedRowIds}
            selectedTraItem={selectedTraItem}
            setSelectedRowIds={setSelectedRowIds}
          />
        )}
      </Grid>
      {!!rowsToLabel && (
        <LabelPreviewModal
          open={previewModalOpen}
          handleClose={() => setPreviewModalOpen(false)}
          dataset={rowsToLabel!}
          download={downloadAndReset}
          removeRow={(row: LabeledData) => {
            setRowsToLabel({
              ...rowsToLabel,
              unlabeledData: rowsToLabel.unlabeledData.concat(row.data),
              labeledData: rowsToLabel.labeledData.filter(
                (d) => d.data.flip_id !== row.data.flip_id,
              ),
            });
          }}
        />
      )}
    </Grid>
  ) : (
    <UploadButton onUpload={parseCsv} />
  );
};

export default LabelPage;
