import React from 'react'

export default function Alert(props) {
  const capitalize = (word) => {
    if (word === "danger"){
      word = "error"
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
     props.alert && <div role="alert" className={`alert alert-${props.alert.type} alert-dismissible fade show`}>
        <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
        </div>
  )
}
