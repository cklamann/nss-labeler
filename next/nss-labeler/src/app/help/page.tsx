"use client";

import React from "react";
import { Box, Grid2 as Grid, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";

import help1Image from "../../../public/help-upload.png";
import help2Image from "../../../public/help-select-tra.png";
import help3Image from "../../../public/help-select-tra-2.png";
import help4Image from "../../../public/help-check-label-group.png";
import help5Image from "../../../public/help-labeling-interface.png";
import help6Image from "../../../public/help-labeling-interface-2.png";
import help7Image from "../../../public/help-labeling-interface-3.png";
import help8Image from "../../../public/help-labeling-interface-4.png";
import help9Image from "../../../public/help-labeling-interface-5.png";
import help10Image from "../../../public/help-labeling-interface-6.png";

export default function Help() {
  return (
    <Grid justifyContent="center" container direction="row">
      <Grid size={{ xs: 9 }} container direction="column" spacing={2}>
        <Grid>
          <Typography textAlign="center" variant="h4">
            Using the labelleing app
          </Typography>
        </Grid>
        <Grid>
          <Typography>
            <Bold>Purpose</Bold>: The Labelling app allows you to quickly select
            unlabeled items from the latest FLIP dataset and assign them NSS
            Codes.
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="h5" textAlign="center">
            Walkthrough
          </Typography>
        </Grid>
        <Grid container>
          <Grid>
            <Typography>
              1. Begin by uploading the CSV of unlabelled data. If you don't
              have a CSV of unlabeled data, please contact a lab member or
              administrator.
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={250}
            height={209}
            src={help1Image}
          />
        </Grid>
        <Grid container direction="column" alignItems="center">
          <Grid>
            <Typography>
              2. You will see a table of unlabeled rows. To begin labelling,
              first choose a TRA Item. This will filter the data so that only
              rows with that TRA item code are visible.
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={350}
            height={188}
            src={help2Image}
          />
          <Grid>
            <Typography variant="caption">The default table view.</Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={350}
            height={188}
            src={help3Image}
          />
          <Grid>
            <Typography variant="caption">The filtered table view.</Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center">
          <Grid>
            <Typography>
              3. To begin labelling, check some of the rows and click the "Start
              Labelling" button. In general, it is easiest to label the rows in
              chunks that share the same NSS code. For instance, if you are
              interested in adding items labelled "Rosemary", "Garlic", and
              "Mint" from the subset of rows with the TRA Item "V03" to the
              training set, you might begin by searching for "rosemary" and then
              checking the rows you wish to label.
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={405}
            height={102}
            src={help4Image}
          />
          <Grid>
            <Typography variant="caption">
              Check the rows you wish to label. It's most efficient to search by
              NSS code keywords.
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center">
          <Grid>
            <Typography>
              4. After clicking the "Start Labelling" button, you will see the
              labelling interface at the top of the page. The leftmost panel
              contains boxes for the labelled and unlabelled data. In the middle
              is a card giving the details of the currently selected row. On the
              rightmost panel is a search box for looking up NSS codes.
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={800}
            height={325}
            src={help5Image}
          />
          <Grid>
            <Typography variant="caption">The labelling interface.</Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center">
          <Grid>
            <Typography>
              5. Use the search box to find the appropriate NSS Code and click
              "Assign" to assign it to the current selection. NSS Codes printed
              in green are already in the training set, while those printed in
              orange are not. Whenever possible, it's better to select a code
              that is already in the training set than to add a new one. This
              will move the item to the "Labeled Data" box.
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={400}
            height={178}
            src={help6Image}
          />
          <Grid>
            <Typography variant="caption">Search for an NSS Code</Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={434}
            height={148}
            src={help7Image}
          />
          <Grid>
            <Typography variant="caption">Assign an NSS Code</Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={435}
            height={133}
            src={help8Image}
          />
          <Grid>
            <Typography variant="caption">
              Use the checkboxes to add more rows to the labelling interface
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center">
          <Grid>
            <Typography>
              6. Continue adding items to the labelling section using the
              checkboxes. When you are finished labelling this TRA Item, click
              "Preview and Download" to export to CSV and reset the interface.
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={435}
            height={128}
            src={help9Image}
          />
          <Grid>
            <Typography variant="caption">
              Assign the new rows NSS Codes
            </Typography>
          </Grid>
          <HelpSectionImage
            alt="upload-data"
            width={400}
            height={178}
            src={help10Image}
          />
          <Grid>
            <Typography variant="caption">
              Export the labeled data to CSV
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    component="span"
    sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
  >
    {children}
  </Box>
);

const HelpSectionImage: React.FC<{
  alt: string;
  height: number;
  priority?: boolean;
  src: StaticImageData;
  width: number;
}> = ({ alt, height, src, priority, width }) => (
  <Grid justifyContent="center" container flexGrow={1}>
    <Grid>
      <Image
        alt={alt}
        height={height}
        priority={priority}
        src={src}
        width={width}
      />
    </Grid>
  </Grid>
);
