import React from 'react'

import { Link } from 'react-router-dom'


function PageNotFound(props) {
    return (
        <div>
            Page not found
            <Link to="/menu"> click me </Link> to go to dashboard
        </div>
    )
}



export default PageNotFound

