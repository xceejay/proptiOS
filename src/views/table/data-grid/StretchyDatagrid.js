import React, { useState, useEffect, useRef } from 'react'

import { DataGrid } from '@mui/x-data-grid'
import _ from 'lodash'
import { CircularProgress, Grid } from '@mui/material'

const StretchyDataGrid = props => {
  const { columns, ...restProps } = props
  const [mappedColumns, setMappedColumns] = useState(_.clone(columns))
  const [resized, setResized] = useState(false)
  const ref = useRef(null)

  const autoSizeColumns = () => {
    const domRows = [...(ref.current?.querySelectorAll('.MuiDataGrid-row') || [])]
    const domReady = props.rows?.length === 0 || domRows.length

    if (!domReady) {
      setTimeout(autoSizeColumns)

      return
    }

    setMappedColumns(prevColumns => {
      const newMappedColumns = _.clone(prevColumns)

      newMappedColumns.forEach((col, idx) => {
        const maxContentWidth = domRows.reduce(
          (previousMax, dR) => Math.max(previousMax, dR.childNodes[idx].scrollWidth),
          0
        )
        if (maxContentWidth < ref.current.clientWidth / newMappedColumns.length) {
          col.width = maxContentWidth
          delete col.flex
        } else {
          delete col.width
          col.flex = 1
        }
      })

      setResized(true)

      return newMappedColumns
    })
  }

  useEffect(() => {
    autoSizeColumns()
  }, [props.rows])

  return (
    <>
      {!resized && (
        <Grid
          container
          alignItems='center'
          justifyContent='center'
          style={{
            height: '100%',
            position: 'absolute',
            opacity: 0.8,
            backgroundColor: 'white',
            textAlign: 'center',
            zIndex: 1
          }}
        >
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        </Grid>
      )}
      <DataGrid
        ref={ref}
        onResize={autoSizeColumns}
        columns={mappedColumns}
        {
          ...restProps  
        }
      />
    </>
  )
}

export default StretchyDataGrid
