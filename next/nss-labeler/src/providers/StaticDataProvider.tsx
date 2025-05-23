"use client";

import React, { createContext } from "react";
import { NSSCode, TRA } from "@/lib/ts/types";

interface StaticDataProps {
  nssCodes: NSSCode[] | null;
  tras: TRA[] | null;
}

export const StaticDataContext = createContext<StaticDataProps>({
  nssCodes: null,
  tras: null,
});

interface StaticDataProviderProps {
  value: StaticDataProps;
  children: React.ReactNode;
}

const StaticDataProvider: React.FC<StaticDataProviderProps> = ({
  children,
  value,
}) => {
  return (
    <StaticDataContext.Provider value={value}>
      {children}
    </StaticDataContext.Provider>
  );
};

export default StaticDataProvider;
