"use client";

import React from "react";
import {
  AppBar,
  Grid2 as Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Help } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <AppBar position="static" color="primary" sx={{ marginBottom: 3 }}>
      <Toolbar component={Grid} justifyContent="center">
        <Grid flexGrow={1} size={{ xs: 4 }}></Grid>
        <Grid flexGrow={1} size={{ xs: 4 }}>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
            textAlign="center"
            variant="h3"
          >
            NSS Labeler
          </Typography>
        </Grid>
        <Grid flexGrow={1} justifyContent="flex-end" container size={{ xs: 4 }}>
          <Grid>
            <IconButton onClick={() => router.push("/help")}>
              <Help sx={{ color: "white" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
