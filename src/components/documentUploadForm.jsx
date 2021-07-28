import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import useForm from '../hooks/useForm';
import axios from 'axios';

export default function DocumentUploadForm(props){

    const [user, setUser] = useState(props.user);
    const [show, setShow] = useState(false);
    const [student, setStudent] = useState(props.student);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    const handleClose = () => {setShow(false); setShowWarning(false)};
    const handleShow = () => setShow(true);

    const saveFile = (e) =>{
        if (typeof e.target.files[0] != 'undefined'){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }

    const uploadFile = async (e) => {
        console.log(file);
        if (file.size/1024/1024 > 28){
            setShowWarning(true);
            return
        }
        const formData = new FormData();
        formData.append('Document', file);
        formData.append('DocumentName', fileName);
        try{
            let response = await axios.post(`https://localhost:44394/api/documents/relationship=${student.relationshipId}`, formData, {headers: {Authorization: 'Bearer ' + user.token}});
            console.log(response);
        }
        catch(err){
            alert('Error uploading file!\n' + err)
        }
        handleClose();
    }

    return(
        <>
        <div className='text-center m-2'>
            <Button variant="success" onClick={handleShow}>Upload File</Button>
        </div>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Upload file for {student.student.firstName} {student.student.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" onChange={saveFile} />
                {showWarning && <Form.Text className='text-danger'>File size must not exceed 28MB.</Form.Text>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={uploadFile}>Upload</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}