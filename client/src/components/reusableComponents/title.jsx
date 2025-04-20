import React, { useEffect } from 'react'

const Title = ({title}) => {
  useEffect(() => {
    document.title = title
  }, [title])
}

export default Title