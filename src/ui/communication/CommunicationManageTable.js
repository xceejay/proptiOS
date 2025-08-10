// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Hooks Imports
import { useCommunication } from 'src/hooks/useCommunication'
import toast from 'react-hot-toast'
// import CustomCommunicationToolbar from 'src/views/table/data-grid/CustomerCommunicationToolbar'

const RowOptions = ({ id, row, setCommunicationData, communicationData, setLoading }) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const [editCommunicationOpen, setEditCommunicationOpen] = useState(false)
  const toggleEditCommunicationDrawer = () => setEditCommunicationOpen(!editCommunicationOpen)

  const communication = useCommunication()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    setEditCommunicationOpen(true)
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          href={'/communication/manage/' + id + '/transactions'}
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>

        <MenuItem onClick={() => handleEdit()} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:pencil' fontSize={20} />
          Edit
        </MenuItem>
      </Menu>
    </>
  )
}

const CommunicationManageTable = () => {
  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'timestamp',
      headerName: 'Date/Time',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {new Date(row.timestamp).toLocaleString()}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'pm_user',
      headerName: 'User',
      renderCell: ({ row }) => {
        const { pm_user } = row
        const { name, email } = pm_user || {}

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {name || 'Unknown User'}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email || 'N/A'}
              </Typography>
            </Box>
          </Box>
        )
      },
      valueGetter: params => {
        const { pm_user } = params.row
        return pm_user ? `${pm_user.name || 'Unknown User'} (${pm_user.email || 'N/A'})` : 'Unknown User'
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'user_action',
      headerName: 'Action',
      renderCell: ({ row }) => {
        let actionLabel
        let actionColor

        switch (row.user_action) {
          case 'Created':
            actionLabel = 'Created'
            actionColor = 'success'
            break
          case 'Updated':
            actionLabel = 'Updated'
            actionColor = 'info'
            break
          case 'Deleted':
            actionLabel = 'Deleted'
            actionColor = 'error'
            break
          case 'Viewed':
            actionLabel = 'Viewed'
            actionColor = 'secondary'
            break
          default:
            actionLabel = row.user_action || 'Unknown'
            actionColor = 'warning' // Assign default colors for unknown actions
        }

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={actionLabel}
            color={actionColor}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 300,
      field: 'response_description',
      headerName: 'Description',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.response_description || 'No description'}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: 'status_code',
      headerName: 'Status',
      renderCell: ({ row }) => {
        let statusLabel
        let statusColor

        switch (row.status_code) {
          case 200:
          case 201:
            statusLabel = 'Success'
            statusColor = 'success'
            break
          case 400:
          case 404:
            statusLabel = 'Failed'
            statusColor = 'error'
            break
          case 500:
            statusLabel = 'Error'
            statusColor = 'error'
            break
          default:
            statusLabel = 'Failed'
            statusColor = 'error'
        }

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={statusLabel}
            color={statusColor}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      },
      valueGetter: params => {
        const { status_code } = params.row

        switch (status_code) {
          case 200:
          case 201:
            return 'Success'
          case 400:
          case 404:
            return 'Failed'
          case 500:
            return 'Error'
          default:
            return 'Unknown'
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'ip_address',
      headerName: 'IP Address',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.ip_address || 'Unknown'}
        </Typography>
      )
    }
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: ({ row }) => (
    //     <RowOptions setLoading={setLoading} setCommunicationData={setCommunicationData} communicationData={communicationData} id={row.id} row={row} />
    //   )
    // }
  ]

  const communication = useCommunication()
  const [loading, setLoading] = useState(true) // New loading state

  const [communicationData, setCommunicationData] = useState({ items: [] })
  const [value, setValue] = useState('')
  const [addCommunicationOpen, setAddCommunicationOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [statusValue, setStatusValue] = useState('')
  const [invitationStatusValue, setInvitationStatusValue] = useState('')

  const [invitationStatuses, setInvitationStatuses] = useState([
    { text: 'All', value: '' },
    { text: 'Pending', value: 'pending' },
    { text: 'Expired', value: 'expired' },
    { text: 'Accepted', value: 'accepted' },
    { text: 'Resent', value: 'resent' }
  ])

  const [statuses, setStatuses] = useState([
    { text: 'All', value: '' },
    { text: 'Active', value: 'active' },
    { text: 'Inactive', value: 'inactive' },
    { text: 'Disabled', value: 'disabled' }
  ])

  const [filterModel, setFilterModel] = useState({
    items: [
      { field: 'status', operator: 'equals', value: statusValue },
      { field: 'invitation_status', operator: 'equals', value: invitationStatusValue }
    ]
  })

  useEffect(() => {
    communication.getAllCommunicationLogs(
      { page: paginationModel?.page, limit: paginationModel?.pageSize },
      responseData => {
        const { data } = responseData
        setLoading(false)

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.message || 'Failed to fetch communication')

          return
        }

        setCommunicationData(data)
        console.log('aduit data', communicationData)
      },
      error => {
        console.log('communication log error', error)
        setLoading(false)

        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }, [paginationModel])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  // Filter communication based on the search value
  // const filteredCommunication = communicationData.items.filter(
  //   communication =>
  //     (communication.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
  //     (communication.email?.toLowerCase() || '').includes(value.toLowerCase()) ||
  //     (communication.address?.toLowerCase() || '').includes(value.toLowerCase())
  // )
  const [filteredCommunicationLogs, setFilteredCommunicationLogs] = useState([])
  useEffect(() => {
    const filtered =
      communicationData?.items?.filter(
        row =>
          (statusValue ? row.status === statusValue : true) &&
          (invitationStatusValue ? row.invitation_status === invitationStatusValue : true) &&
          (row.email?.toLowerCase() || '').includes(value.toLowerCase())
      ) || []

    setFilteredCommunicationLogs(filtered) // Update the filteredCommunication state
  }, [communicationData, statusValue, invitationStatusValue, value])

  return (
    <Grid container spacing={6.5}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Communication Logs' />
          <CardContent>
            {/* <CommunicationTableHeader
              rows={filteredCommunication}
              columns={columns}
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddCommunicationDrawer}
            /> */}
            <DataGrid
              loading={false}
              autoHeight
              rowHeight={62}
              rows={filteredCommunicationLogs || []}
              columns={columns}
              slots={{
                toolbar: CustomCommunicationToolbar,
                noRowsOverlay: CustomNoRowsOverlay

                // loadingOverlay: {
                //   variant: 'skeleton',
                //   noRowsVariant: 'skeleton'
                // }
              }}
              filterModel={filterModel} // Track the filterModel state
              onFilterModelChange={newFilterModel => {
                // Update the filterModel state dynamically for any field or operator change
                setFilterModel(newFilterModel)

                // Loop through each filter item and dynamically update values
                newFilterModel.items.forEach(item => {
                  switch (item.field) {
                    case 'status':
                      setStatusValue(item.value)
                      break
                    case 'invitation_status':
                      setInvitationStatusValue(item.value)
                      break

                    default:
                      // Handle other fields dynamically if needed
                      break
                  }
                })
              }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Quick Search',
                  value: value,
                  // addText: 'Add Communication',
                  statusValue: statusValue,
                  setStatusValue: setStatusValue,
                  invitationStatusValue: invitationStatusValue,
                  setInvitationStatusValue: setInvitationStatusValue,
                  statuses: statuses,
                  invitationStatuses: invitationStatuses,

                  handleFilter: handleFilter
                }
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
        </Card>
      </Grid>
    </Grid>
  )
}

// export const getServerSideProps = async () => {}

export default CommunicationManageTable
