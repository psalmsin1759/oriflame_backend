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
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CustomChip from 'src/@core/components/mui/chip'

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

const SearchWinnersByGames = () => {
  const auth = useAuth()
  const user = auth.user

  // ** Hook
  const theme = useTheme()

  const [buttonLoading, setButtonLoading] = useState(false)

  const [data, setData] = useState([])

  const [selectedGame, setSelectedGame] = useState(0)

  const URL = '/getPlayersByGames/' + selectedGame

  const [games, setGames] = useState([])

  const URLGAMES = '/getGames'

  const loadTransaction = async () => {
    const response = await axios.get(URL, {
      Headers: { 'content-type': "'application/json" }
    })

    setData(response?.data.data)
  }

  const loadGames = async () => {
    const responseGames = await axios.get(URLGAMES, {
      Headers: { 'content-type': "'application/json" }
    })
    setGames(responseGames?.data.data)

    console.log(games)
  }

  useEffect(() => {
    loadGames()

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
      field: 'player_id',
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
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: params => {
        const color = params.value == 0 ? 'success' : 'warning'

        const eligible = params.value == 0 ? 'Eligible' : 'Not Eligible'

        return (
          <CustomChip
            skin='light'
            size='small'
            label={eligible}
            color={color}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'created_at',
      headerName: 'Date'
    }
  ]

  const handleSearch = () => {
    loadTransaction()
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <PageHeader
          title={<Typography variant='h5'>Players By Games</Typography>}
          subtitle={<Typography variant='body2'></Typography>}
        />
      </Grid>
      <br />

      <Card>
        <CardHeader title='Select Games' />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', m: 2 }} className='demo-space-x'>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Select Game</InputLabel>
              <Select
                label='Select Game'
                name='game'
                required
                onChange={e => setSelectedGame(e.target.value)}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                {games?.map(game => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
        <Box sx={{ height: 1000, m: 2 }}>
          <DataGrid columns={columns} rows={data} pageSize={100} components={{ Toolbar: CustomToolbar }} />
        </Box>
      </Card>
    </DatePickerWrapper>
  )
}

export default SearchWinnersByGames
