import React from "react";
import Grid from "@mui/material/Grid2";
import StaticDataProvider from "@/providers/StaticDataProvider";
import tras from "@/lib/data/tras.json";
import nssCodes from "@/lib/data/nss_with_optional_tra.json";
import { LabelPage } from "@/components";

const HomePage: React.FC = () => (
  <StaticDataProvider
    value={{
      nssCodes,
      tras,
    }}
  >
    <Grid container direction="column">
      <LabelPage />
    </Grid>
  </StaticDataProvider>
);

export default HomePage;
