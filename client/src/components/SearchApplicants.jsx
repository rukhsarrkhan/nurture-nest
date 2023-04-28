import React from 'react';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

const SearchApplicants = (props) => {
  const [searchInput, setSearchInput] = React.useState("");

  const handleChange = (e) => {
    setSearchInput(e.target.value)
    props.searchValue(e.target.value);
  };
  return (
    <form method='POST ' onSubmit={(e) => {e.preventDefault();}} name='formName' className='center' >
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
        {/* <input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} /> */}
      </label>
    </form>
  );
};

export default SearchApplicants;
