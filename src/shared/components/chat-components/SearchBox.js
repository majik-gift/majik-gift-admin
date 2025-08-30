"use client";
import { Search } from "@mui/icons-material";
import { Stack, TextField } from "@mui/material";

const SearchBox = ({ setSearch }) => {
  return (
    <Stack direction="row" alignItems="center" width={1} sx={SearchStyles.inputContainer}>
      <Search sx={SearchStyles.icon} />
      <TextField
        placeholder="Search"
        sx={{
          flexGrow: 1,
          "& fieldset": { border: "none" },
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Stack>
  );
};

export default SearchBox;

const SearchStyles = {
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: "100px",
    px: 3,
    border: "1px solid #DEDEDE",
  },
  icon: {
    color: "secondary.main",
  },
};
