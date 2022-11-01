import React from 'react'

function Select(
    {
        name,
        label,
        value,
        error="",
        onChange,
        children
    }
) {
  return (
<div className="form-group">
    <label htmlFor={name}>{label}</label>
    <select
        value={value}
        className={"form-control " +  (error && "is-invalid")} 
        id={name}
        name={name}
        onChange={onChange}
    >
        {children}
    </ select>
        {error && <p className="invalid-feedback"> {error} </p>}  
</div>
  )
}

export default Select