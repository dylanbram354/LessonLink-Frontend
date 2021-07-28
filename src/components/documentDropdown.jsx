import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DropdownButton, Dropdown } from 'react-bootstrap';

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

    function generateDropdownLinks(){
        let links = docs.map(doc => {
            return(
                <Dropdown.Item key={doc.documentId} onClick={() => downloadFile(doc.documentId)} >{doc.documentName}</Dropdown.Item>
            )
        })
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
                    Download Files
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