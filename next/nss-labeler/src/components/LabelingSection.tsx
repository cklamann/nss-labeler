"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AutocompleteSearch } from ".";
import {
  itemIsLabeled,
  LabelDataset,
  LabeledData,
  NSSCode,
  UnlabeledData,
} from "@/lib/ts/types";

interface LabelingSectionProps {
  dataToLabel: LabelDataset;
  nssCodes: NSSCode[];
  setRowLabeled: (row: UnlabeledData, nssCode: NSSCode) => void;
  setRowUnlabeled: (row: LabeledData) => void;
  removeRow: (row: UnlabeledData) => void;
}

const LabelingSection: React.FC<LabelingSectionProps> = ({
  dataToLabel,
  nssCodes,
  removeRow,
  setRowLabeled,
  setRowUnlabeled,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedNss, setSelectedNss] = useState<NSSCode | null>(null);
  const [activeRecord, setActiveRecord] = useState<UnlabeledData | null>(
    dataToLabel.unlabeledData.length ? dataToLabel.unlabeledData[0] : null
  );

  const sortedNss = useMemo(
    () =>
      nssCodes.sort((a) =>
        a.tra_items.includes(dataToLabel.tra_item) ? -1 : 1
      ),
    [dataToLabel, nssCodes]
  );

  const markActiveItemLabeled = (code: NSSCode | null) => {
    if (activeRecord && code) {
      setRowLabeled(activeRecord, code);
      const currentIdx = dataToLabel.unlabeledData.findIndex(
        (d) => d.flip_id === activeRecord.flip_id
      );

      if (dataToLabel.unlabeledData.length > currentIdx + 1) {
        setActiveRecord(dataToLabel.unlabeledData[currentIdx + 1]);
      } else if (dataToLabel.unlabeledData.length > 1) {
        //things can get mixed up when adding/subtracting
        setActiveRecord(dataToLabel.unlabeledData[0]);
      } else {
        setActiveRecord(null);
      }
    }
  };

  return (
    <Grid
      container
      size={{ xs: 12 }}
      direction="row"
      spacing={2}
      justifyContent="space-between"
    >
      <Grid width="100%">
        <Typography textAlign="center" variant="h4">
          Labeling TRA Item {dataToLabel.tra_item}
        </Typography>
      </Grid>
      <Grid width="100%">
        <Typography textAlign="center">
          {dataToLabel.tra_item_description}
        </Typography>
      </Grid>
      <Grid size={{ xs: 4 }} container direction="column" spacing={2}>
        <Grid>
          <RecordBox
            items={dataToLabel.unlabeledData}
            onSelect={(record) => setActiveRecord(record as UnlabeledData)}
            selectedItem={activeRecord || undefined}
            title="Unlabeled Data"
            renderItem={(item) => (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                spacing={0}
                wrap="nowrap"
              >
                <Grid size={{ xs: 11 }}>
                  <Typography variant="caption">{item.product_name}</Typography>
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRow(item);
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          />
        </Grid>
        <Grid>
          <RecordBox
            items={dataToLabel.labeledData}
            title="Labeled Data"
            renderItem={(item) => (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                wrap="nowrap"
              >
                <Grid size={{ xs: 11 }}>
                  <Typography variant="caption">
                    {item.data.product_name} ({item.nssCode.nss_code})
                  </Typography>
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => setRowUnlabeled(item)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 4 }}>
        <Grid>{!!activeRecord && <LabelCard record={activeRecord} />}</Grid>
      </Grid>
      <Grid size={{ xs: 4 }} container direction="column">
        <Grid>
          <AutocompleteSearch
            label="NSS Lookup"
            getOptionLabel={(option) =>
              `${option.nss_code.toString()}: ${option.nss_description}`
            }
            onSelect={(v) => setSelectedNss(v)}
            onSearchChange={(v) => setSearchText(v)}
            options={sortedNss}
            searchText={searchText}
            value={selectedNss}
          />
        </Grid>
        <Grid>
          <Button
            disabled={!selectedNss || !activeRecord}
            onClick={() => markActiveItemLabeled(selectedNss)}
          >
            Assign
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LabelingSection;

const getItemData = (item: UnlabeledData | LabeledData) =>
  itemIsLabeled(item) ? item.data : item;

interface LabelCardProps {
  record: UnlabeledData | LabeledData;
}

const LabelCard: React.FC<LabelCardProps> = ({ record }) => (
  <Card sx={{ maxHeight: "500px", overflowY: "auto" }}>
    <CardHeader
      sx={(theme) => ({ backgroundColor: theme.palette.secondary.light })}
      title={<Typography>{getItemData(record).product_name}</Typography>}
    />
    <CardContent>
      <Typography>{getItemData(record).brand}</Typography>
      <Typography>{getItemData(record).ingredients}</Typography>
    </CardContent>
  </Card>
);

interface RecordBoxProps<T extends UnlabeledData | LabeledData> {
  items: T[];
  onSelect?: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
  selectedItem?: T;
  title: string;
}

function RecordBox<T extends UnlabeledData | LabeledData>({
  items,
  onSelect,
  selectedItem,
  title,
  renderItem,
}: RecordBoxProps<T>) {
  return (
    <Box
      sx={(theme) => ({
        border: `${theme.palette.primary.dark} 1px solid`,
        borderRadius: "5px",
      })}
    >
      <Typography
        variant="h5"
        sx={(theme) => ({
          borderBottom: `${theme.palette.primary.dark} 1px solid`,
        })}
        textAlign="center"
      >
        {title} ({items.length})
      </Typography>
      <List sx={{ padding: 0, overflowY: "auto", height: "300px" }}>
        {items.map((item, i) => (
          <ListItem
            onClick={() => onSelect && onSelect(item)}
            sx={(theme) => ({
              paddingX: 0.5,
              paddingY: 0,
              margin: 0,
              borderBottom:
                i !== items.length - 1
                  ? `${theme.palette.primary.dark} 1px solid`
                  : "none",
              backgroundColor: (theme) =>
                selectedItem &&
                getItemData(selectedItem).flip_id === getItemData(item).flip_id
                  ? theme.palette.grey[300]
                  : "inherit",
              cursor: "pointer",
              "& :hover": {
                color: theme.palette.primary.light,
              },
            })}
            key={`${getItemData(item).product_name}-${i}`}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <Typography>{getItemData(item).product_name}</Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
