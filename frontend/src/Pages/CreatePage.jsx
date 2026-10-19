import { ArrowLeftIcon } from 'lucide-react'
import React from 'react'
import {Link,useNavigate} from "react-router"
import { useState } from 'react'
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios"


const CreatePage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const  handleSubmit = async (e) => {
    e.preventDefault() // prevent from refreshing the page
    if(!title.trim() || !content.trim()) { // makes sure that the title and content are not empty or just whitespace
      toast.error("Please fill in all fields")
      return
    }
    setLoading(true)

    try {
       await axiosInstance.post("/notes", { title, content })
      toast.success("Note created successfully")
      navigate("/")

    } catch (error) {

      console.log("Error creating note:", error)

      if(error.response?.status ==429){
        toast.error("You are being rate limited. Please try again later.",{
          duration:4000,
          icon: '⚠️',
        })
        }else{
          toast.error("Failed to create note")
        }
      
    }finally{
      setLoading(false)
    }




  }
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" >
            
            </ArrowLeftIcon>
            Back to Notes
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input type="text" placeholder="Note title" className="input input-bordered" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Note Content</span>
                  </label>
                  <textarea placeholder="Write your note here..." className="textarea textarea-bordered" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                </div>
              

               <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Note'}
                </button>
               </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage