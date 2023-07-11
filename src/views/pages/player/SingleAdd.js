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
import FormHelperText from '@mui/material/FormHelperText'
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
  playerid: '',
  firstname: '',
  lastname: '',
  brandpartnerno: '',
  city: '',
  phone: '',
  director: ''
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
  firstname: yup
    .string()
    .min(3, obj => showErrors('name', obj.value.length, obj.min))
    .required(),
  playerid: yup.string().required(),
  brandpartnerno: yup.string().required(),
  city: yup.string().required(),
  phone: yup.string().required(),
  director: yup.string().required()
})

const SingleAdd = () => {
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

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [buttonLoading, setButtonLoading] = useState(false)

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      firstname: data.firstname,
      lastname: data.lastname,
      playerid: data.playerid,
      brandpartnerno: data.brandpartnerno,
      city: data.city,
      phone: data.phone,
      director: data.director,
      lotteryid: selectedGame
    }

    const URL = '/addplayer'

    try {
      const response = await axios.post(URL, qs.stringify(input), {
        Headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })

      if (response?.data.status) {
        reset()

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
    } catch (error) {
      if ((error.response && error.response.status === 500) || error.response.status === 404) {
        setButtonLoading(false)
        setSeverity('error')
        setOpen1(true)
        setOutputValue(error.message)
      }
    }
  }
  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
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

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='firstname'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='First Name'
                    onChange={onChange}
                    fullWidth
                    placeholder='First Name'
                    error={Boolean(errors.firstname)}
                  />
                )}
              />
              {errors.firstname && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.firstname.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='lastname'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Last Name'
                    onChange={onChange}
                    fullWidth
                    placeholder='Last Name'
                    error={Boolean(errors.lastname)}
                  />
                )}
              />
              {errors.lastname && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.lastname.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='playerid'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='ID'
                    onChange={onChange}
                    fullWidth
                    type='number'
                    placeholder='ID'
                    error={Boolean(errors.playerid)}
                  />
                )}
              />
              {errors.playerid && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.playerid.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='brandpartnerno'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Brand Partner No'
                    onChange={onChange}
                    fullWidth
                    placeholder='Brand Partner NO'
                    error={Boolean(errors.brandpartnerno)}
                  />
                )}
              />
              {errors.brandpartnerno && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.brandpartnerno.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='city'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='City'
                    onChange={onChange}
                    fullWidth
                    placeholder='City'
                    error={Boolean(errors.city)}
                  />
                )}
              />
              {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Phone'
                    onChange={onChange}
                    fullWidth
                    placeholder='Phone'
                    error={Boolean(errors.phone)}
                  />
                )}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='director'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Director'
                    onChange={onChange}
                    fullWidth
                    placeholder='Director'
                    error={Boolean(errors.director)}
                  />
                )}
              />
              {errors.director && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.director.message}</FormHelperText>
              )}
            </FormControl>
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

export default SingleAdd
