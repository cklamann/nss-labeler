"use client";

import React, { useCallback, useState } from "react";
import { DataGrid, GridValidRowModel } from "@mui/x-data-grid";
import { GridBaseColDef } from "@mui/x-data-grid/internals";
import { Checkbox } from "@mui/material";
import { UnlabeledData } from "@/lib/ts/types";

interface FlipDataTableProps {
  data: UnlabeledData[];
  labeledIds: number[];
  selectedRowIds: number[];
  selectedTraItem: string;
  setSelectedRowIds: (rowIds: number[]) => void;
}

type FlipCol<T extends GridValidRowModel> = GridBaseColDef<T> & {
  hideOnLoad?: boolean;
};

const getFlipCols = (
  labeledIds: number[],
  onSelectClick: (rowId: number) => void,
  selectedIds: number[],
  selectedTraItem: string,
): FlipCol<UnlabeledData>[] => [
  {
    field: "flip_id",
    headerName: "Flip ID",
    width: 100,
  },
  {
    field: "product_name",
    headerName: "Product Name",
    flex: 0.75,
  },
  {
    field: "brand",
    headerName: "Brand",
    flex: 0.5,
  },
  {
    field: "ingredients",
    headerName: "Ingredients",
    flex: 1,
  },
  {
    field: "tra_cat",
    headerName: "TRA CAT",
    width: 100,
  },
  {
    field: "tra_item",
    headerName: "TRA Item",
    width: 100,
  },
  {
    field: "selected",
    headerName: "Select",
    width: 100,
    renderCell: ({ row }) => (
      <Checkbox
        disabled={!selectedTraItem || labeledIds.includes(row.flip_id)}
        size="small"
        sx={{ padding: 0, margin: 0 }}
        checked={selectedIds.includes(row.flip_id)}
        onClick={() => onSelectClick(row.flip_id)}
      />
    ),
  },
];

const FlipDataTable: React.FC<FlipDataTableProps> = ({
  data,
  labeledIds,
  selectedRowIds,
  selectedTraItem,
  setSelectedRowIds,
}) => {
  const [pageSize, setPageSize] = useState<number>(50);
  const [page, setPage] = useState<number>(0);

  const onCheckboxClick = useCallback(
    (rowId: number) => {
      if (selectedRowIds.includes(rowId)) {
        setSelectedRowIds(selectedRowIds.filter((r) => r !== rowId));
      } else {
        setSelectedRowIds(selectedRowIds.concat(rowId));
      }
    },
    [selectedRowIds, setSelectedRowIds],
  );

  return (
    <DataGrid
      columns={getFlipCols(
        labeledIds,
        onCheckboxClick,
        selectedRowIds,
        selectedTraItem,
      )}
      density="compact"
      filterMode="client"
      getRowId={(row) => row.flip_id}
      //onRowClick={(params) => (onSelect ? onSelect(params.row) : () => null)}
      onPaginationModelChange={({ page, pageSize }) => {
        setPage(page);
        setPageSize(pageSize);
      }}
      pageSizeOptions={[10, 20, 50, 100]}
      paginationModel={{ page, pageSize }}
      paginationMode="client"
      //paginationModel={paginationModel}
      resetPageOnSortFilter
      rowHeight={32}
      rows={data}
      //rowSelection={!!selected}
      //rowSelectionModel={selected ? [selected] : selected}
      // slots={{
      //   toolbar: RSGridToolbar,
      // }}
      sortingMode="client"
    />
  );
};

export default FlipDataTable;
