import React from 'react'
import { Container } from 'reactstrap'

import { Header } from 'components/Header'
import Footer from 'components/Footer'

export default function AuthLayout({ children }) {
    return (
        <>  
            <Header/>
            <Container>
                {children}
            </Container>
            <Footer/>
        </>
    )
}
