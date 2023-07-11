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

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

const WinnerPage = () => {
  const auth = useAuth()
  const user = auth.user

  const [data, setData] = useState([])

  const URL = '/getwinners'

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

  return (
    <Card>
      <CardHeader title='Winners' />
      <CardContent>
        <Box sx={{ height: 1000 }}>
          <DataGrid columns={columns} rows={data} pageSize={50} components={{ Toolbar: CustomToolbar }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default WinnerPage
