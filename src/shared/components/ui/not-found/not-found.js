"use client";
import { NoRecordFound } from "@/assets";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

function NotFoundData({ title }) {
  return (
    <Stack width={1} alignItems="center" gap={2}>
      <Image src={NoRecordFound} alt="" />
      <Typography variant="h6">{title}</Typography>
    </Stack>
  );
}

export default NotFoundData;
