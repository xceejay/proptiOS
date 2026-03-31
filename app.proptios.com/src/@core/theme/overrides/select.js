export default {
  MuiSelect: {
    styleOverrides: {
      select: {
        minWidth: '6rem !important',
        minHeight: 44,
        '&.MuiTablePagination-select': {
          minWidth: '1.5rem !important'
        },
        '@media (max-width: 600px)': {
          minHeight: 48,
          paddingTop: 14,
          paddingBottom: 14
        }
      }
    }
  }
}
