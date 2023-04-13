import React from 'react';
import TextField from '@mui/material/TextField';

const SearchApplicants = (props) => {
  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };
  return (
    <form method='POST ' onSubmit={(e) => {e.preventDefault();}} name='formName' className='center' >
      <label>
        <span>Search Nannies: </span>
        <TextField
                className="formField"
                label="searchTerm"
                onChange={handleChange}
                // required
                variant="outlined"
                color="secondary"
                sx={{ mb: 3 }}
                fullWidth
                // value={address}
                // error={addressError}
              />
        <input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} />
      </label>
    </form>
  );
};

export default SearchApplicants;
