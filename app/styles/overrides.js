// https://coolors.co/24292e-172a3a-27ae60-8898aa-e0f2e9
export default {
  MuiStepper: {
    root: {
      padding: 0
    }
  },
  MuiDialog: {
    paper: {
      padding: 0
    }
  },
  MuiDialogContent: {
    root: {
    }
  },
  MuiLinearProgress: {
    root: {
      flex: '1 1 100%',
      margin: '1em 0'
    },
    bar: {
      backgroundColor: 'rgba(39,174,96,1)'
    }
  },
  MuiIconButton: {
    root: {
      color: '#9e9e9e',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      '&:hover': {
        color: '#757575',
        backgroundColor: 'transparent'
      }
    }
  },
  MuiButton: {
    root: {
      backgroundColor: '#fff',
      boxShadow: 'none',
      border: '1px solid #29b6f6',
      borderRadius: '4px',
      textTransform: 'none',
      color: '#29b6f6',
      '&:hover': {
        backgroundColor: '#e1f5fe'
      }
    },
    label: {},
    flatPrimary: {},
    colorInherit: {},
    contained: {},
    containedPrimary: {
      border: 'none',
      boxShadow: '0 1px 3px 0 #B3E5FC',
      transition: 'box-shadow 150ms ease',
      color: '#fff'
    },
    disabled: {},
    fab: {}
  },
  MuiInput: {
    root: {
      borderRadius: '3px',
      padding: '5px 0 5px 13px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      fontSize: '16px',
      '&$focused': {
        boxShadow: '0 0 0 1px #34d058'
      },
      '&$error': {
        color: '#d73a49',
        boxShadow: '0 0 0 1px #d73a49'
      }
    },
    formControl: {},
    input: {},
    multiline: {},
    inputMultiline: {},
    fullWidth: {}
  },
  MuiFormLabel: {
    root: {
      color: '#9e9e9e !important'
    }
  },
  MuiInputLabel: {
    root: {
      padding: '5px 0 5px 13px'
    },
    formControl: {},
    shrink: {
      transform: 'translate(0, -10px) scale(1)'
    },
    animated: {
      color: '#9e9e9e'
    }
  },
  MuiMenu: {},
  MuiMenuItem: {
    root: {
      padding: '20px 40px',
      backgroundColor: '#f6f8fa',
      color: '#123',
      '&:hover': {
        backgroundColor: '#fafafa',
        color: '#111'
      },
      '&$selected': {
        color: '#24292e',
        backgroundColor: '#fff'
      }
    }
  },
  MuiListItemIcon: {
    root: {
      color: '#29b6f6'
    }
  },
  MuiToggleButton: {
    root: {
      padding: '8px 12px',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      height: 'auto',
      border: '1px solid #29b6f6',
      color: '#29b6f6',
      '&:hover': {
        backgroundColor: 'transparent'
      },
      '&$selected': {
        border: '1px solid #29b6f6',
        backgroundColor: '#29b6f6',
        boxShadow: '0 1px 3px 0 #B3E5FC',
        transition: 'box-shadow 150ms ease',
        color: '#fff',
        '&:after': {
          opacity: 0
        },
        '&:hover': {
          backgroundColor: 'rgb(28, 127, 172)',
          borderColor: 'rgb(28, 127, 172)'
        }
      }
    },
    label: {}
  },
  MuiListItem: {
    root: {
      backgroundColor: '#f6f8fa',
      boxShadow: '0 1px 3px 0 #e6ebf1',
      transition: 'box-shadow 150ms ease'
    },
    gutters: {
      margin: 0
    },
    container: {},
    default: {},
    dense: {},
    divider: {},
    button: {
      '&:hover': {
        backgroundColor: '#EEEEEE',
        color: '#32325d'
      }
    },
    secondaryAction: {}
  },
  MuiList: {
    root: {
      padding: 0
    },
    padding: {
      padding: 0
    },
    dense: {},
    subheader: {}
  },
  MuiPaper: {
    root: {
      boxShadow: 'none'
    },
    rounded: {}
  },
  MuiTypography: {
    root: {
      color: '#123',
      lineHeight: 1.6
    }
  },
  MuiTableCell: {},
  MuiTableRow: {
    head: {},
    footer: {}
  },
  MuiSwitch: {
    root: {
      color: '#ddd'
    },
    bar: {},
    icon: {},
    checked: {},
    disabled: {}
  },
  MuiAppBar: {
    root: {
      padding: 0,
      margin: 0,
      backgroundColor: '#586069'
    },
    positionFixed: {},
    positionAbsolute: {},
    positionStatic: {},
    colorDefault: {},
    colorPrimary: {
      backgroundColor: '#24292e'
    }
  },
  MuiCircularProgress: {
    colorPrimary: {
      color: '#8898AA'
    },
    circle: {
      width: '30px',
      height: '30px'
    },
    circleIndeterminate: {}
  },
  MuiCheckbox: {
    root: {
      '&$checked': {
        color: '#32325d'
      }
    }
  },
  MuiBottomNavigationButton: {
    root: {
      '&:hover': {
        backgroundColor: '#E0E2E4'
      }
    },
    label: {
      color: '#586069',
      fontSize: '14px',
      '&:hover': {
        color: '#24292e'
      }
    },
    selectedLabel: {
      color: 'rgba(15,32,46,1)',
      fontSize: '14px'
    },
    icon: {
      color: '#6a737d'
    },
    selectedIconOnly: {
      color: 'rgba(39,174,96,1)'
    },
    wrapper: {
      backgroundColor: 'rgba(255,255,255,.1)'
    }
  },
  MuiBottomNavigation: {
    root: {
      backgroundColor: 'rgba(0,0,0,.04)',
      borderTop: '1px solid rgba(0,0,0,.05)',
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px'
    }
  }
}
