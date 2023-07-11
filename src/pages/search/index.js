// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import moment from 'moment'
import { useAuth } from 'src/hooks/useAuth'

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

const SearchWinnersPage = () => {
  const auth = useAuth()
  const user = auth.user

  // ** Hook
  const theme = useTheme()

  const [startDatePicker, setStartDatePicker] = useState(new Date())
  const [endDatePicker, setEndDatePicker] = useState(new Date())

  const [buttonLoading, setButtonLoading] = useState(false)
  const [startDate, setStartDate] = useState('01-01-2022')
  const [endDate, setEndDate] = useState('01-01-2050')

  const [data, setData] = useState([])

  const URL = '/getWinnersByDate/' + startDate + '/' + endDate

  useEffect(() => {
    const loadTransaction = async () => {
      const response = await axios.get(URL, {
        Headers: { 'content-type': "'application/json" }
      })

      setData(response?.data.data)
    }

    loadTransaction()
  }, [])

  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'first_name',
      headerName: 'First Name'
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'last_name',
      headerName: 'Last Name'
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'playerid',
      headerName: 'ID'
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'brand_partner_no',
      headerName: 'brand_partner_no'
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'city',
      headerName: 'City'
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'director',
      headerName: 'Director'
    },

    {
      flex: 0.15,
      field: 'lotteryname',
      minWidth: 150,
      headerName: 'Game'
    },

    {
      flex: 0.15,
      minWidth: 200,
      field: 'created_at',
      headerName: 'Date'
    }
  ]

  const handleSearch = () => {
    const sDateValue = moment(startDatePicker).format('DD-MM-YYYY')
    const eDateValue = moment(endDatePicker).format('DD-MM-YYYY')
    setStartDate(sDateValue)
    setEndDate(eDateValue)
    loadTransaction()
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={<Typography variant='h5'>Winner Report</Typography>}
          subtitle={<Typography variant='body2'>Data Export</Typography>}
        />
      </Grid>
      <br />

      <Card>
        <CardHeader title='Search Record' />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', m: 2 }} className='demo-space-x'>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label='Start Date'
              dateFormat='dd-MM-yyyy'
              value={startDatePicker}
              onChange={newValue => setStartDatePicker(newValue)}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label='
                End Date'
              dateFormat='dd-MM-yyyy'
              value={endDatePicker}
              onChange={newValue => setEndDatePicker(newValue)}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
          <LoadingButton
            loading={buttonLoading}
            loadingPosition='start'
            onClick={handleSearch}
            size='large'
            sx={{ mr: 2 }}
            variant='contained'
          >
            Search
          </LoadingButton>
        </Box>
        <br />
        <Box sx={{ height: 500, m: 2 }}>
          <DataGrid columns={columns} rows={data} pageSize={12} components={{ Toolbar: CustomToolbar }} />
        </Box>
      </Card>
    </DatePickerWrapper>
  )
}

export default SearchWinnersPage
