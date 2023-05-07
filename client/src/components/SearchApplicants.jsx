import React from 'react';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { Typography } from '@mui/material';
import { purple } from "@mui/material/colors";

const SearchApplicants = (props) => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchInput,"will search for this")
    props.searchValue(searchInput);
  }

  const handleChange = (e) => {
    setSearchInput(e.target.value)
  };
  return (
    <form method='POST ' onSubmit={handleSearch} name='formName' >
      <label>
        <TextField
                className="formField"
                label="Search Nannies"
                onChange={handleChange}
                variant="filled"
                color="secondary"
                sx={{ mb: 3 }}
                fullWidth
                value={searchInput}
              />
        <Button variant="contained" sx={{ bgcolor: purple[700] }} type="submit">Search</Button>
        {/* <input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} /> */}
      </label>
    </form>
  );
};

export default SearchApplicants;
