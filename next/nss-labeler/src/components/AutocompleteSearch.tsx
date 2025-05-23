"use client";

import React from "react";
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  ListItem,
  TextField,
} from "@mui/material";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import { NSSCode } from "@/lib/ts/types";

const renderRow = (
  props: ListChildComponentProps<
    [
      React.HTMLAttributes<HTMLLIElement> & {
        key: any;
      },
      NSSCode,
      state: AutocompleteRenderOptionState
    ][]
  >
) => {
  const { data, index, style } = props;

  const [liProps, nssItem, autocompleteState] = data[index];

  return (
    <ListItem
      {...liProps}
      style={{
        ...style,
        whiteSpace: "nowrap",
        color: !!nssItem.tra_items.length ? "green" : "orange",
      }}
    >
      {nssItem.nss_code}-{nssItem.nss_description}{" "}
      {nssItem.tra_items.length ? `[${nssItem.tra_items.join(", ")}]` : ""}
    </ListItem>
  );
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>(
  function OuterElementType(props, ref) {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  }
);

const useResetCache = (data: any) => {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
};

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: [
    React.HTMLAttributes<HTMLLIElement> & {
      key: any;
    },
    NSSCode,
    state: AutocompleteRenderOptionState
  ][] = [];
  (
    children as [
      React.HTMLAttributes<HTMLLIElement> & {
        key: any;
      },
      NSSCode,
      state: AutocompleteRenderOptionState
    ][]
  ).forEach((item: any) => {
    itemData.push(item);
  });

  const itemCount = itemData.length;

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={250}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={() => 20}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

interface AutocompleteSearchProps<T extends Record<string, any>> {
  error?: boolean;
  fullWidth?: boolean;
  getOptionLabel: (option: T) => string;
  helperText?: string;
  label?: string;
  options: T[];
  onSearchChange: (text: string) => void;
  onSelect: (selectedOption: T | null) => void;
  searchText: string;
  value: T | null;
}

function AutocompleteSearch<T extends Record<string, any>>({
  error,
  getOptionLabel,
  helperText,
  label,
  options,
  onSearchChange,
  onSelect,
  searchText,
  value,
}: AutocompleteSearchProps<T>) {
  return (
    <Autocomplete
      autoComplete
      clearOnBlur={false}
      clearOnEscape={true}
      getOptionLabel={getOptionLabel}
      fullWidth
      disablePortal
      openOnFocus={true}
      onInputChange={(_, v) => {
        onSearchChange(v);
      }}
      disableListWrap
      onChange={(_, v: T | null) => onSelect(v)}
      slotProps={{
        listbox: {
          component: ListboxComponent,
        },
      }}
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            sx: (theme) => ({
              "& fieldset": {
                borderWidth: "2 px",
                borderStyle: "solid",
                borderColor: theme.palette.primary.light,
                borderRadius: "5px",
              },
            }),
          }}
          error={error}
          helperText={helperText}
          label={label || "Search"}
          variant="outlined"
          value={searchText}
        />
      )}
      //this is getting wrapped by react-window, so we're just forwarding the arguments to `renderRow`
      //so that it can render the children dynamically
      //eslint-disable-next-line
      //@ts-ignore
      renderOption={(props, option, state) => [props, option, state]}
      value={value}
    />
  );
}
export default AutocompleteSearch;
