import { useState } from 'react'
import axios from 'axios'
const S3 = require('aws-sdk/clients/s3');

async function postImage({image, description}){
    const formData = new FormData();
    formData.append("image", image)
    formData.append("description", description)
    const result = await axios.post('http://localhost:3000/nanny/images', formData, {headers: {'Content-Type': 'multipart/'}})
    return result.data
}

function UploadImage(){

    const [file, setFile ] = useState()
    const [description, setDescription] = useState("")
    const [images, setImages] = useState([])

    const submit = async event => {
        event.preventDefault()
        const result = await postImage({image: file, description})
        setImages([result.image, ...images])
    }

    const fileSelected = event => {
        const file = event.target.files[0]
        setFile(file)
    }

    return(
        <div className="UploadImage">
        <form onSubmit={submit}>
            <input onChange={fileSelected} type="file" accept="image/*"></input>
            <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
            <button type="submit">Submit</button>
        </form>

        {images.map(image => (
            <div key={image}>
                <img src={image}></img>   
                     </div>
        ))}
</div>
    );
}

export default UploadImage;
