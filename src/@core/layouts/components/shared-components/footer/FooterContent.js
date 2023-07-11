// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`Copyright © ${new Date().getFullYear()} ORIFLAME. `}

        {`Powered by `}
        <Link target='_blank' href='https://qnetixtechnologies.com/'>
          QNetix Technologies
        </Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
