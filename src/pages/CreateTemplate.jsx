// CreateTemplate Component
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { FaSpinner, FaTrash, FaUpload } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { db, storage } from '../config/firebase.config';
import { adminIds, initialTags } from '../utils/helpers';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplate from '../hooks/useTemplate';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const {
    data: templates,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch
  } = useTemplate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({
      ...prevRec, [name]: value
    }));
  };
const {data:user, isLoading}= useUser()

const navigate = useNavigate()
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageAsset((prevAsset) => (
      { ...prevAsset, isImageLoading: true }
    ));

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setImageAsset((prevAsset) => ({
            ...prevAsset,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100, 
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error: Authorization revoked`);
          } else {
            toast.error(`Error: ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(getDownloadURL => {
            setImageAsset((prevAsset) => ({
              ...prevAsset,
              uri: getDownloadURL,
              isImageLoading: false,
            }));
            toast.success("Image uploaded");
          });
        }
      );
    } else {
      toast.warning("Invalid File Format");
      setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: false }));
    }
  };

  const deleteAnImageObject = async () => {
    setImageAsset((prevAsset) => (
      { ...prevAsset, isImageLoading: true }
    ));
    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      setImageAsset({
        isImageLoading: false,
        uri: null,
        progress: 0
      });
      toast.success("Image removed");
    }).catch(error => {
      toast.error(`Error: ${error.message}`);
      setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: false }));
    });
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleSelectedTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(selected => selected !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name: templates && templates.length >0
      ? `Template${templates.length+1}`
      : "Template1",
      timeStamp: timeStamp
    };
    await setDoc(doc(db,"templates",id),_doc).then(()=>{
      setFormData((prevData)=>({
        ...prevData,title:"",
        imageURL:""}))
        setImageAsset((prevAsset)=>({...prevAsset,
          uri:null,
        }))  
        setSelectedTags([])
        templatesRefetch()
        toast.success("New template added successfully")
    }).catch(err=>{
      toast.error(`Error: ${err.message}`)
    })
  };
  // remove data from the cloud
  const removeTemplate = async (template) =>{
    const deleteRef = ref(storage,template?.imageURL)
    await deleteObject(deleteRef).then(async()=>{
 await deleteDoc(doc(db,"templates",template?._id)).then(()=>{
  toast.success("Template deleted successfully..")
  templatesRefetch()
 }).catch(err =>{
  toast.error(`Error: ${err.message}`)
 })
})
  }


useEffect(()=>{
if(!isLoading && !adminIds.includes(user?.uid)){
  navigate('/',{replace:true})
}
},[user,isLoading])


  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-1 items-center justify-start flex-col gap-4 px-2'>
        <div className="w-full">
          <p className="text-lg to-txtPrimary">Create a new Template</p>
        </div>
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-gray-400 uppercase font-semibold">TempId:{""}</p>
          <p className="text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0 ? 
            `Template${templates.length + 1}` 
            : "Template1"}
          </p>
        </div>
        <input type="text"
          name="title"
          className='w-full px-4 py-4 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none'
          placeholder='Template Title'
          value={formData.title}
          onChange={handleInputChange} />
        <div className="w-full bg-gray-50 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[440px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <FaSpinner color='#498FCD' size={40} />
              <p>{imageAsset?.progress.toFixed(2)}%</p>
            </div>
          ) : (
            !imageAsset?.uri ? (
              <label className='w-full cursor-pointer h-full'>
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="flex flex-col items-center justify-center cursor-pointer">
                    <FaUpload className='text-2xl' />
                    <p className='text-lg text-txtLight gap-4'>Click to upload</p>
                  </div>
                </div>
                <input type="file" className='w-0 h-0' accept='.jpg,.jpeg,.png' onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img src={imageAsset?.uri} className='w-full h-full object-cover' loading='eager' alt="" />
                <div className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer" onClick={deleteAnImageObject}>
                  <FaTrash className='text-white' />
                </div>
              </div>
            )
          )}
        </div>
        <div className='w-full flex items-center flex-wrap gap-2 border-gray-300 py-1 rounded-md'>
          {initialTags.map((tag, index) => (
            <div key={index} className={`px-3 py-1 border rounded-md ${selectedTags.includes(tag)
              ? 'border-txtDark bg-txtDark text-white'
              : 'border-gray-300 bg-transparent text-gray-300'
              } cursor-pointer`}
              onClick={() => handleSelectedTags(tag)}>
              <p className="text-sm">{tag}</p>
            </div>
          ))}
        </div>
        <div className="w-full">
          <button className={`px-4 py-3 text-lg text-white capitalize shadow-md rounded-md ${!formData.title || !imageAsset.uri
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 cursor-pointer'
            }`} onClick={pushToCloud} disabled={!formData.title || !imageAsset.uri}>
            Save & Publish
          </button>
        </div>
      </div>
        {/* Right container */}
        <div className='col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1
        py-4'>
        {templatesIsLoading 
        ?(<React.Fragment>
          <div className="w-full h-full flex items-center justify-center">
            <ClipLoader className='text-3xl text-gray-400' size={40} />
          </div>
        </React.Fragment>
      ):(
      <React.Fragment>
        {templates && templates.length > 0 ? 
            <React.Fragment>
              <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3
              gap-4'>
              {templates?.map(template =>(
                <div key={template._id} className='w-full h-[500px] rounded-md overflow-hidden
                relative'>
                  <img src={template?.imageURL} className='w-full h-full object-cover' loading='eager' alt="" />
                  <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer' onClick={()=> removeTemplate(template)}>
                    <FaTrash className='text-white text-sm' />  
                  </div>
                </div>
              ))}
              </div>
            </React.Fragment> 
            : <React.Fragment>
              <div className="w-full h-full flex items-center justify-center">
            <FaSpinner className='text-3xl text-gray-400'  size={40}/>
            <p className='text-xl tracking-wider capitalize to-txtPrimary'>
              No templates found
            </p>
          </div>
              </React.Fragment>}
      </React.Fragment>)}
      </div>
    </div>
    
  )
}

export default CreateTemplate;
