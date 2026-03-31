const Autocomplete = skin => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: ({ theme }) => ({
          ...(skin === 'bordered' && { boxShadow: 'none', border: `1px solid ${theme.palette.divider}` })
        }),
        option: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            minHeight: 48,
            paddingTop: 12,
            paddingBottom: 12
          }
        })
      }
    }
  }
}

export default Autocomplete
