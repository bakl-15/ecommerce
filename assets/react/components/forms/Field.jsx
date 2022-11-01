import React from 'react'

function Field({
       name,
       label,
       value,
       onChange,
       placeholder,
       type="text",
       error=""}) {
  return (
    <>
    
    <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <input
                
                    value={value}
                    onChange={onChange}
                    type={type} 
                    className={"form-control m-2 " +  (error && "is-invalid")} 
                    placeholder={placeholder || label}
                    id={name}
                    name={name} />
                {error && <p className="invalid-feedback"> {error} </p>}
            </div>
    
    </>
  )
}

export default Field