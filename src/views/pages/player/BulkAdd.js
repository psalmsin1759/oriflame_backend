// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import toast from 'react-hot-toast'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import qs from 'qs'

import axios from '../../../api/axios'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAuth } from 'src/hooks/useAuth'

const defaultValues = {
  game: ''
}

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  game: yup
    .string()
    .min(3, obj => showErrors('game', obj.value.length, obj.min))
    .required()
})

const BulkAdd = () => {
  const auth = useAuth()
  const user = auth.user
  const adminID = user?.id

  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState(0)
  const [lastID, setLastID] = useState(1)

  useEffect(() => {
    loadGames()
  }, [])

  const URL = '/getGames'
  const loadGames = async () => {
    const response = await axios.get(URL, {
      Headers: { 'content-type': "'application/json" }
    })
    setGames(response?.data.data)
    setLastID(response.data.lastid)
  }

  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const [buttonLoading, setButtonLoading] = useState(false)

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const handleSubmit = async e => {
    setButtonLoading(true)

    if (!file) {
      setError('Please select a file to upload.')
      setButtonLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('game', selectedGame)
    formData.append('file', file)

    const URL = '/addBulkPlayers'

    const response = await axios.post(URL, formData, {
      Headers: { 'content-type': 'multipart/form-data' }
    })

    if (response?.data.status) {
      setButtonLoading(false)

      setSeverity('success')
      setOutputValue('Successful')
      setOpen1(true)

      toast.success('Successful')
    } else {
      setButtonLoading(false)
      setSeverity('error')
      setOpen1(true)
      setOutputValue(response?.data.message)
    }
  }
  return (
    <CardContent>
      <form onSubmit={e => e.preventDefault()} noValidate>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box sx={{ mb: 6 }}>
              <Collapse in={open1}>
                <Alert
                  severity={severity}
                  action={
                    <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen1(false)}>
                      <Close fontSize='inherit' />
                    </IconButton>
                  }
                >
                  {outputValue}
                </Alert>
              </Collapse>
              {/* <Button disabled={open1} variant='outlined' sx={{ mt: 2 }} onClick={() => setOpen1(true)}>
                    Open Collapse
                  </Button> */}
            </Box>
          </Grid>

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
                  <MenuItem value={game.id}>{game.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Upload Excel File
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Grid item xs={12} sm={6}>
              <TextField
                required={true}
                onChange={handleFileChange}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                fullWidth
                type='file'
                label=''
                placeholder='Excel File'
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <br />
          </Grid>

          <Grid item xs={12}>
            <LoadingButton
              loading={buttonLoading}
              loadingPosition='start'
              onClick={handleSubmit}
              size='large'
              type='submit'
              sx={{ mr: 2 }}
              variant='contained'
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default BulkAdd
