const SuccessAlert = () => {
  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        gap: '1rem',
        backgroundColor: 'lightgreen',
        borderRadius: '10px'
    }}>
        <h2>
            Paiment effectué avec succès! <span role="img" aria-label="money">💸</span>
        </h2>
    </div> 
  )
}

export default SuccessAlert