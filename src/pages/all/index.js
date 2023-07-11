// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'

import axios from '../../api/axios'
import { useAuth } from 'src/hooks/useAuth'
import CustomChip from 'src/@core/components/mui/chip'

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

const AllPage = () => {
  const auth = useAuth()
  const user = auth.user

  const [data, setData] = useState([])

  const URL = '/getplayers'

  useEffect(() => {
    const loadTransaction = async () => {
      const response = await axios.get(URL, {
        Headers: { 'content-type': "'application/json" }
      })

      setData(response?.data.data)
    }

    // Call the function
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
      field: 'player_id',
      minWidth: 100,
      headerName: 'ID'
    },
    {
      flex: 0.15,
      field: 'brand_partner_no',
      minWidth: 130,
      headerName: 'Brand Partner No'
    },
    {
      flex: 0.15,
      field: 'city',
      minWidth: 100,
      headerName: 'City'
    },
    {
      flex: 0.15,
      field: 'phone',
      minWidth: 150,
      headerName: 'phone'
    },
    {
      flex: 0.15,
      field: 'director',
      minWidth: 150,
      headerName: 'Director'
    },
    {
      flex: 0.15,
      field: 'lotteryname',
      minWidth: 100,
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
      minWidth: 100,
      field: 'created_at',
      headerName: 'Date'
    }
  ]

  return (
    <Card>
      <CardHeader title='Players' />
      <CardContent>
        <Box sx={{ height: 1000 }}>
          <DataGrid columns={columns} rows={data} pageSize={50} components={{ Toolbar: CustomToolbar }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default AllPage
