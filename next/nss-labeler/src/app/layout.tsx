import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar,
  Container,
  Grid2 as Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import theme from "@/lib/mui/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NSS Labeler",
  description: "A labeling interface for FLIP data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xl">
              <AppBar
                position="static"
                color="primary"
                sx={{ marginBottom: 3 }}
              >
                <Toolbar component={Grid} justifyContent="center">
                  <Grid>
                    <Typography variant="h3">NSS Labeler</Typography>
                  </Grid>
                </Toolbar>
              </AppBar>
              {children}
              {/* <Footer /> */}
            </Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
