import React from 'react';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";

const SearchJobs = (props) => {
  // THIS FILE NEEDS TO BE DELETED

  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchInput, "will search for this");
    props.searchValue(searchInput);
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };
  return (
    <form method='POST ' onSubmit={handleSearch} name='formName' >
      <label><br />
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
      </label>
    </form>
  );
};

export default Searchjobs;
