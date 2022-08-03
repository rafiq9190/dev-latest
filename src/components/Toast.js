import React from 'react';
import Toast from 'react-bootstrap/Toast';
function Toasty({ data }) {
  console.log('🚀 ~ file: Toast.js ~ line 4 ~ Toasty ~ data', data);
  return (
    <Toast>
      <Toast.Header>
        <img
          src="holder.js/20x20?text=%20"
          className="rounded me-2"
          alt=""
        />
        <strong className="me-auto"></strong>
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>{data}</Toast.Body>
    </Toast>
  );
}

export default Toasty;
