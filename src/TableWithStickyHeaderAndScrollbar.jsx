import React from 'react'
import PropTypes from 'prop-types'

export default function TableWithStickyHeaderAndScrollbar({data}) {
  const tableRef = React.useRef(null)

  React.useEffect(()=> {
    handleScrolls()
  }, [])

  function handleScrolls () { 
    const initWidth = tableRef.current.getBoundingClientRect().width
    tableRef.current.dataset.initWidth = initWidth

    // Fix cell widths
    const cells = tableRef.current.querySelectorAll('th, td')
    cells.forEach((cell) => {
      const cellWidth = cell.getBoundingClientRect().width
      cell.style.minWidth = `${cellWidth}px`
    })

    // Make sticky
    tableRef.current.classList.add('sticky')

    const newWidth = tableRef.current.getBoundingClientRect().width // after sticky styles added
    const percentWidth = (initWidth / newWidth) * 100
    const thead = tableRef.current.querySelector("thead")
    const tbody = tableRef.current.querySelector("tbody")

    const stickyScrollbar = document.createElement("div")
    const stickyScrollbarContent = document.createElement("div")

    stickyScrollbar.classList.add("table-sticky-scrollbar")
    stickyScrollbarContent.style.width = `${percentWidth}%`
    stickyScrollbarContent.classList.add("table-sticky-scrollbar__content")

    stickyScrollbar.appendChild(stickyScrollbarContent)
    tableRef.current.insertAdjacentElement("beforebegin", stickyScrollbar)

    const container = stickyScrollbar.closest("section")
    container.style.overflow = "unset" // Unset overflow for sticky to work properly

    
    /*
     * Sync scrolls
     */
    thead.addEventListener("scroll", (e) => {
      const scrollLeft = e.target.scrollLeft
      tbody.scrollLeft = scrollLeft
    })
    tbody.addEventListener("scroll", (e) => {
      const scrollLeft = e.target.scrollLeft
      thead.scrollLeft = scrollLeft
      stickyScrollbar.scrollLeft = scrollLeft
    })
    stickyScrollbar.addEventListener("scroll", (e) => {
      const scrollLeft = e.target.scrollLeft
      tbody.scrollLeft = scrollLeft
    })

    /*
     * Handle window resize
     */
    window.addEventListener("resize", () => {
      const newWidth = tableRef.current.getBoundingClientRect().width
      const percentWidth = (initWidth / newWidth) * 100
      stickyScrollbarContent.style.width = `${percentWidth}%`
    })
  }

  return (
      <table ref={tableRef} id={data.id} data-sticky-table-head-and-scrollbar>
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={`table-${data.id}-th-${index}`}>
                <span>{header.text}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={`table-${data.id}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`row-${rowIndex}-cell-${cellIndex}`}>
                    {cell.text}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
  )
}

TableWithStickyHeaderAndScrollbar.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired
      })
    ).isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired
        })
      )
    ).isRequired
  }).isRequired
}
