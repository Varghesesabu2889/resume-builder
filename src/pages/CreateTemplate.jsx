import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { PuffLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { db, storage } from '../config/firebase.config';
import { initialTags } from '../utils/helpers';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplate from '../hooks/useTemplate';

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
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100, // Correctly updating progress
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) { // Error handling for specific error
            toast.error(`Error: Authorization revoked`);
          } else {
            toast.error(`Error: ${error.message}`); // General error handling
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
      toast.warning("Invalid File Format"); // Warning for invalid file format
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
    return allowedTypes.includes(file.type); // Correctly checking file type
  };

  const handleSelectedTags = (tag) => {
    if (selectedTags.includes(tag)) {
      // If selected then remove it
      setSelectedTags(selectedTags.filter(selected => selected !== tag));
    } else {
      // If not selected, add it
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
      name: templates && templates.length > 0 
        ? `Template ${templates.length + 1}` 
        : `Template1`,
      timeStamp: timeStamp
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prevData) => ({
          ...prevData, title: "", imageURL: ""
        }));
        setImageAsset((prevAsset) => ({ ...prevAsset, uri: null }));
        setSelectedTags([]);
        templatesRefetch();
        toast.success("Data pushed to cloud");
      })
      .catch(err => {
        toast.error(`Error: ${err.message}`);
      });
  };

  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
      {/* Left container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-1 items-center justify-start flex-col gap-4 px-2'>
        {/* Heading */}
        <div className="w-full">
          <p className="text-lg to-txtPrimary">Create a new Template</p>
        </div>
        {/* Template ID section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-gray-400 uppercase font-semibold">TempId:{""}</p>
          <p className="text-sm text-txtDark capitalize font-bold">{templates && templates.length > 0 ? `Template${templates.length + 1}` : "Template1"}</p>
        </div>
        {/* Template title section */}
        <input type="text"
          name="title"
          className='w-full px-4 py-4 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none'
          placeholder='Template Title'
          value={formData.title}
          onChange={handleInputChange} />
        {/* File uploader section */}
        <div className="w-full bg-gray-50 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[440px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color='#498FCD' size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className='w-full cursor-pointer h-full'>
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex flex-col items-center justify-center cursor-pointer">
                        <FaUpload className='text-2xl' />
                        <p className='text-lg text-txtLight gap-4'>Click to upload</p>
                      </div>
                    </div>
                    <input type="file" className='w-0 h-0' accept='.jpg,.jpeg,.png' onChange={handleImageChange} />
                  </label>
                </React.Fragment>) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img src={imageAsset?.uri} className='w-full h-full object-cover' loading='eager' alt="" />
                    {/* Delete action */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer" onClick={deleteAnImageObject}>
                      <FaTrash className='text-white' />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
        {/* Tags */}
        <div className='w-full flex items-center flex-wrap gap-2 border-gray-300 py-1 rounded-md'>
          {initialTags.map((tag, index) => (
            <div key={index} onClick={() => handleSelectedTags(tag)} className={`border border-gray-300 py-1 px-2 rounded-md cursor-pointer ${selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""}`}>
              <p className='text-xs'>{tag}</p>
            </div>
          ))}
        </div>
        {/* button action */}
        <button type='button'
          className='w-full bg-blue-700 text-white rounded-md py-3'
          onClick={pushToCloud}>
          Save
        </button>
      </div>

      {/* Right container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9'>
        {/* Placeholder for the right container */}
      </div>
    </div>
  );
};

export default CreateTemplate;
