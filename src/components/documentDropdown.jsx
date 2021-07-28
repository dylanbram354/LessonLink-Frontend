import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DropdownButton, Dropdown, Button } from 'react-bootstrap';

export default function DocumentDropdown(props){

    const [user, setUser] = useState(props.user);
    const [relationshipId, setRelationshipId] = useState(props.relationshipId);
    const [docs, setDocs] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDocs();
    }, [])

    async function getDocs(){
        try{
            let response = await axios.get(`https://localhost:44394/api/documents/info/relationship=${props.relationshipId}`, {headers: {Authorization: 'Bearer ' + user.token}});
            setDocs(response.data);
        }
        catch(err){
            alert('Error retrieving files.\n' + err)
        }
    }

    function getFileNameFromContentDisposition(contentDisposition) {
        if (!contentDisposition) return null;
      
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
      
        return match ? match[1] : null;
      }

    async function downloadFile(id){
        console.log(id);
        setLoading(true);
        let response = null;
        try{
            response = await axios.get(`https://localhost:44394/api/documents/download/${id}`, {headers: {Authorization: 'Bearer ' + user.token}, responseType: 'blob'});
            setLoading(false);
            console.log(response);
            const data = response.data;
            const url = window.URL.createObjectURL(new Blob([data], {type: response.headers["content-type"]}));
            const actualFileName = getFileNameFromContentDisposition(response.headers['content-disposition']);
            console.log(actualFileName);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", actualFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }
        catch(err){
            alert('Download error!\n' + err);
            setLoading(false);
        }
    }

    async function deleteFile(id){
        if(window.confirm('Are you sure? Your student will no longer be able to access this file.')){
            try{
                let response = await axios.delete(`https://localhost:44394/api/documents/delete/${id}`, {headers: {Authorization: 'Bearer ' + user.token}});
                console.log(response);
                getDocs();
            }
            catch(err){
                alert("Error deleting file.\n" + err)
            }
        }
    }

    function generateDropdownLinks(){
        let links = docs.map(doc => {
            return(
                <Dropdown.Item key={doc.documentId}>
                    {doc.documentName} || 
                    <Button size='sm' className='m-1' onClick={() => downloadFile(doc.documentId)}>Download</Button>
                    {user.role==='Teacher' && <Button size='sm' variant='danger' className='m-1' onClick={() => deleteFile(doc.documentId)}>Delete</Button>}
                </Dropdown.Item>
            )
        })
        if (links.length == 0){
            return(
                <span><Button size='sm' variant='link' onClick={() => getDocs()}>No files - click to refresh</Button></span>
            )
        }
        return links
    }

    return(
        <React.Fragment>
        {docs ? 
        <React.Fragment>
            {loading ?
            <p>Downloading...</p>
            :
            <Dropdown>
                <Dropdown.Toggle variant='success'>
                    Select
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {generateDropdownLinks()}
                </Dropdown.Menu>
            </Dropdown>
            }

        </React.Fragment>
        :
        <p>Loading files...</p>
        }
        </React.Fragment>

    )
}