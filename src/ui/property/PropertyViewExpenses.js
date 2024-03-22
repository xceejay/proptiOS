// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const data = [
  {
    color: 'info.main',
    location: 'Switzerland',
    device: 'HP Specter 360',
    icon: 'tabler:brand-windows',
    browser: 'Chrome on Windows',
    recentActivity: '10, July 2022 20:07'
  },
  {
    color: 'error.main',
    device: 'iPhone 12x',
    location: 'Australia',
    browser: 'Chrome on iPhone',
    icon: 'tabler:device-mobile',
    recentActivity: '13, July 2022 10:10'
  },
  {
    location: 'Dubai',
    color: 'success.main',
    device: 'OnePlus 9 Pro',
    icon: 'tabler:brand-android',
    browser: 'Chrome on Android',
    recentActivity: '4, July 2022 15:15'
  },
  {
    location: 'India',
    device: 'Apple IMac',
    color: 'secondary.main',
    icon: 'tabler:brand-apple',
    browser: 'Chrome on macOS',
    recentActivity: '20, July 2022 21:01'
  },
  {
    color: 'info.main',
    location: 'Switzerland',
    device: 'HP Specter 360',
    browser: 'Chrome on Windows',
    icon: 'tabler:brand-windows',
    recentActivity: '15, July 2022 11:15'
  },
  {
    location: 'Dubai',
    color: 'success.main',
    device: 'OnePlus 9 Pro',
    icon: 'tabler:brand-android',
    browser: 'Chrome on Android',
    recentActivity: '14, July 2022 20:20'
  }
]

const PropertyViewExpenses = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={'Expenses'}></CardHeader>
          <Divider></Divider>
          <CardContent></CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PropertyViewExpenses
