const GlobalStyles = theme => {
  const scrollbarThumbColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
  const scrollbarTrackColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
  const scrollbarInactiveColor = theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
  const primaryColor = theme.palette.primary.main

  return {
    // Custom Scrollbar with Arrows
    '::-webkit-scrollbar': {
      width: '12px',
      height: '12px',
      backgroundColor: 'transparent'
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: scrollbarTrackColor,
      borderRadius: '6px',
      margin: '4px',
      backgroundImage: `
        linear-gradient(to bottom, ${scrollbarTrackColor} 30%, transparent 30%, transparent 70%, ${scrollbarTrackColor} 70%),
        linear-gradient(to right, ${scrollbarTrackColor} 30%, transparent 30%, transparent 70%, ${scrollbarTrackColor} 70%)
      `,
      backgroundSize: '100% 20px, 20px 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: scrollbarThumbColor,
      borderRadius: '6px',
      border: '2px solid transparent',
      backgroundClip: 'content-box',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: primaryColor,
        opacity: 0.9,
        '&:after': {
          opacity: 0.6
        }
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        width: '4px',
        height: '4px',
        backgroundColor: theme.palette.common.white,
        borderRadius: '50%',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      },
      '&:active': {
        backgroundColor: primaryColor,
        opacity: 1
      }
    },
    '::-webkit-scrollbar-thumb:horizontal:start:decrement': {
      backgroundImage: `
        linear-gradient(135deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(225deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(transparent, transparent)
      `,
      backgroundSize: '6px 6px, 6px 6px, 100% 100%',
      backgroundPosition: '2px 2px, 2px 2px, 0 0',
      backgroundRepeat: 'no-repeat',
      '&:hover': {
        backgroundImage: `
          linear-gradient(135deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(225deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(transparent, transparent)
        `
      }
    },
    '::-webkit-scrollbar-thumb:horizontal:end:increment': {
      backgroundImage: `
        linear-gradient(315deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(45deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(transparent, transparent)
      `,
      backgroundSize: '6px 6px, 6px 6px, 100% 100%',
      backgroundPosition: 'calc(100% - 2px) 2px, calc(100% - 2px) 2px, 0 0',
      backgroundRepeat: 'no-repeat',
      '&:hover': {
        backgroundImage: `
          linear-gradient(315deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(45deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(transparent, transparent)
        `
      }
    },
    '::-webkit-scrollbar-thumb:vertical:start:decrement': {
      backgroundImage: `
        linear-gradient(225deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(315deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(transparent, transparent)
      `,
      backgroundSize: '6px 6px, 6px 6px, 100% 100%',
      backgroundPosition: '2px 2px, 2px 2px, 0 0',
      backgroundRepeat: 'no-repeat',
      '&:hover': {
        backgroundImage: `
          linear-gradient(225deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(315deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(transparent, transparent)
        `
      }
    },
    '::-webkit-scrollbar-thumb:vertical:end:increment': {
      backgroundImage: `
        linear-gradient(45deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(135deg, transparent 50%, ${scrollbarThumbColor} 50%),
        linear-gradient(transparent, transparent)
      `,
      backgroundSize: '6px 6px, 6px 6px, 100% 100%',
      backgroundPosition: '2px calc(100% - 2px), 2px calc(100% - 2px), 0 0',
      backgroundRepeat: 'no-repeat',
      '&:hover': {
        backgroundImage: `
          linear-gradient(45deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(135deg, transparent 50%, ${primaryColor} 50%),
          linear-gradient(transparent, transparent)
        `
      }
    },
    '::-webkit-scrollbar-thumb:window-inactive': {
      backgroundColor: scrollbarInactiveColor,
      '&:after': {
        display: 'none'
      }
    },
    // For Firefox
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: `${scrollbarThumbColor} transparent`,
      '&:hover': {
        scrollbarColor: `${primaryColor} transparent`
      }
    },

    '.demo-space-x > *': {
      marginTop: '1rem !important',
      marginRight: '1rem !important',
      'body[dir="rtl"] &': {
        marginRight: '0 !important',
        marginLeft: '1rem !important'
      }
    },
    '.demo-space-y > *:not(:last-of-type)': {
      marginBottom: '1rem'
    },
    '.MuiGrid-container.match-height .MuiCard-root': {
      height: '100%'
    },
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#F1F0F5 !important' : '#393D55 !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor:
          theme.palette.mode === 'light' ? 'rgba(93, 89, 108, 0.2) !important' : 'rgba(207, 211, 236, 0.3) !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.primary.main
      }
    }
  }
}

export default GlobalStyles
