import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import { StyledDataGrid } from './ui';

const UITable = ({
  idKey = 'id',
  styledProps,
  tableData = [],
  paginationModel,
  tableColumns = [],
  setPaginationModel,
  height,
  ...otherParams
}) => {
  return (
    <Box sx={{ height: height ?? '70vh', width: '100%' }}>
      <StyledDataGrid
        rows={tableData}
        getRowId={(row) => row[idKey]}
        disableColumnFilter
        disableSelectionOnClick
        disableColumnSelector
        disableColumnMenu
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: true,
        }}
        columnHeaderHeight={50}
        columns={tableColumns}
        styledProps={styledProps}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 15, 20, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        localeText={{
          noRowsLabel: 'No data available', // Change "No rows" text
          loadingOverlayLabel: 'Please wait, loading...', // Change "Loading..." text
        }}
        {...otherParams}
      />
    </Box>
  );
};

UITable.propTypes = {
  idKey: PropTypes.string,
  hideFooter: PropTypes.string,
  styledProps: PropTypes.object,
  paginationModel: PropTypes.object,
  setPaginationModel: PropTypes.func,
  tableData: PropTypes.array.isRequired,
  tableColumns: PropTypes.array.isRequired,
};

export default UITable;
